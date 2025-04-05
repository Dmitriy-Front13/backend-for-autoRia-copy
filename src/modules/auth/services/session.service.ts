import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { User } from '@prisma/__generated__'
import { Request } from 'express'

@Injectable()
export class SessionService {
	async saveSession(req: Request, user: User) {
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
