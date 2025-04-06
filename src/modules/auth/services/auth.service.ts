import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthMethod, TokenType, User } from '@prisma/__generated__'
import { verify } from 'argon2'
import { Request, Response } from 'express'

import { PrismaService } from '@/core/prisma/prisma.service'
import { UserService } from '@/modules/user/user.service'

import { LoginInput } from '../inputs/login.input'
import { RegisterInput } from '../inputs/register.input'
import { RequestRegisterInput } from '../inputs/request-register.input'
import { OAuthService } from '../oauth/oauth.service'

import { EmailConfirmationService } from './email-confirmation.service'

@Injectable()
export class AuthService {
	public constructor(
		private readonly userService: UserService,
		private readonly configService: ConfigService,
		private readonly oauthService: OAuthService,
		private readonly prismaService: PrismaService,
		private readonly emailConfirmationService: EmailConfirmationService
	) {}

	public async requestRegister(input: RequestRegisterInput) {
		const user = await this.userService.findByEmail(input.email)

		if (user) {
			throw new ConflictException('User already exists. Please log in.')
		}

		await this.emailConfirmationService.sendVerificationToken(input.email)
		return { message: 'Confirmation email sent successfully.' }
	}

	public async register(req: Request, input: RegisterInput) {
		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token: input.code,
				type: TokenType.REGISTRATION
			}
		})

		if (!existingToken) {
			throw new NotFoundException(
				'Confirmation token not found. Please make sure your token is correct.'
			)
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException(
				'Confirmation token has expired. Please request a new one.'
			)
		}

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.REGISTRATION
			}
		})

		const user = await this.prismaService.user.create({
			data: {
				email: existingToken.email,
				password: input.password,
				firstName: input.firstName,
				lastName: input.lastName,
				method: AuthMethod.CREDENTIALS
			}
		})

		return this.saveSession(req, user)
	}

	public async login(req: Request, input: LoginInput) {
		const user = await this.userService.findByEmail(input.email)

		if (!user || !user.password) {
			throw new NotFoundException(
				'User not found. Please check your credentials.'
			)
		}

		const isValidPassword = await verify(user.password, input.password)

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

		return this.saveSession(req, user)
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
			return this.saveSession(req, user)
		}

		user = await this.userService.create(
			profile.email,
			'',
			profile.name,
			profile.name,
			profile.picture,
			AuthMethod[profile.provider.toUpperCase()]
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

		return this.saveSession(req, user)
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

	private async saveSession(req: Request, user: User) {
		return new Promise((resolve, reject) => {
			req.session.userId = user.id
			req.session.save(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Failed to save session. Please make sure session settings are configured correctly.'
						)
					)
				}
				resolve({ user })
			})
		})
	}
}
