import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthMethod, User } from '@prisma/__generated__'
import { verify } from 'argon2'
import { Request, Response } from 'express'

import { UserService } from '@/modules/user/user.service'

import { LoginDto } from '../dto/login.dto'
import { RegisterDto } from '../dto/register.dto'

@Injectable()
export class AuthService {
	public constructor(
		private readonly userService: UserService,
		private readonly configService: ConfigService
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
		return newUser
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

		// if (!user.isVerified) {
		//   await this.emailConfirmationService.sendVerificationToken(user.email)
		//   throw new UnauthorizedException(
		//     'Your email is not verified. Please check your inbox and confirm your address.'
		//   )
		// }

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

				resolve({
					user
				})
			})
		})
	}
}
