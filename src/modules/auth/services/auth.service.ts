import {
	ConflictException,
	Injectable,
	InternalServerErrorException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthMethod, User } from '@prisma/__generated__'
import { Request, Response } from 'express'

import { UserService } from '@/modules/user/user.service'

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
	public async login() {}
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
							'Не удалось сохранить сессию. Проверьте, правильно ли настроены параметры сессии.'
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
