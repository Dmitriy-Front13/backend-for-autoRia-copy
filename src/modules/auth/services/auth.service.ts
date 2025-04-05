import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthMethod } from '@prisma/__generated__'
import { verify } from 'argon2'
import { Request, Response } from 'express'

import { PrismaService } from '@/core/prisma/prisma.service'
import { UserService } from '@/modules/user/user.service'

import { LoginDto } from '../dto/login.dto'
import { RegisterDto } from '../dto/register.dto'
import { OAuthService } from '../oauth/oauth.service'

import { EmailConfirmationService } from './email-confirmation.service'
import { SessionService } from './session.service'

@Injectable()
export class AuthService {
	public constructor(
		private readonly userService: UserService,
		private readonly configService: ConfigService,
		private readonly oauthService: OAuthService,
		private readonly prismaService: PrismaService,
		private readonly emailConfirmationService: EmailConfirmationService,
		private readonly sessionService: SessionService
	) {}

	public async register(dto: RegisterDto) {
		const isExists = await this.userService.findByEmail(dto.email)
		if (isExists) {
			throw new ConflictException(
				'User with this email already exists. Please use another email or log in.'
			)
		}

		const newUser = await this.userService.create(
			dto.email,
			dto.password,
			dto.name,
			'',
			AuthMethod.CREDENTIALS,
			false
		)
		await this.emailConfirmationService.sendVerificationToken(newUser.email)
		return {
			message:
				'You have successfully registered. Please confirm your email.'
		}
	}

	public async login(req: Request, dto: LoginDto) {
		const user = await this.userService.findByEmail(dto.email)

		if (!user || !user.password) {
			throw new NotFoundException(
				'User not found. Please check your credentials.'
			)
		}

		const isValidPassword = await verify(user.password, dto.password)

		if (!isValidPassword) {
			throw new UnauthorizedException(
				'Invalid password. Please try again or reset your password if you forgot it.'
			)
		}

		// if (user.isTwoFactorEnabled) {
		//   if (!dto.code) {
		//     await this.twoFactorAuthService.sendTwoFactorToken(user.email)
		//     return {
		//       message:
		//         'Two-factor authentication code required. Please check your email.'
		//     }
		//   }

		//   await this.twoFactorAuthService.validateTwoFactorToken(
		//     user.email,
		//     dto.code
		//   )
		// }

		return this.sessionService.saveSession(req, user)
	}

	public async logout(req: Request, res: Response): Promise<void> {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Failed to destroy session. The session might already be terminated or a server error occurred.'
						)
					)
				}
				res.clearCookie(
					this.configService.getOrThrow<string>('SESSION_NAME')
				)
				resolve()
			})
		})
	}

	public async extractProfileFromCode(
		req: Request,
		provider: string,
		code: string
	) {
		const providerInstance = this.oauthService.findByService(provider)

		const profile = await providerInstance!.findUserByCode(code)

		const account = await this.prismaService.account.findFirst({
			where: {
				id: profile.id,
				provider: profile.provider
			}
		})

		let user = account?.userId
			? await this.userService.findById(account.userId)
			: null

		if (user) {
			return this.sessionService.saveSession(req, user)
		}

		user = await this.userService.create(
			profile.email,
			'',
			profile.name,
			profile.picture,
			AuthMethod[profile.provider.toUpperCase()],
			true
		)

		if (!account) {
			await this.prismaService.account.create({
				data: {
					userId: user.id,
					type: 'oauth',
					provider: profile.provider,
					accessToken: profile.access_token,
					refreshToken: profile.refresh_token,
					expiresAt: profile.expires_at || 0
				}
			})
		}

		return this.sessionService.saveSession(req, user)
	}
}
