import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { TokenType } from '@prisma/__generated__'
import { Request } from 'express'
import { v4 as uuidv4 } from 'uuid'

import { MailService } from '@/core/mail/mail.service'
import { PrismaService } from '@/core/prisma/prisma.service'
import { UserService } from '@/modules/user/user.service'

import { ConfirmationDto } from '../dto/email-confirmation.dto'

import { SessionService } from './session.service'

@Injectable()
export class EmailConfirmationService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly userService: UserService,
		private readonly mailService: MailService,
		private readonly sessionService: SessionService
	) {}

	public async sendVerificationToken(email: string) {
		const verificationToken = await this.generateVerificationToken(email)

		await this.mailService.sendConfirmationEmail(
			verificationToken.email,
			verificationToken.token
		)

		return true
	}

	private async generateVerificationToken(email: string) {
		const token = uuidv4()
		const expiresIn = new Date(new Date().getTime() + 3600 * 1000)

		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email,
				type: TokenType.REGISTRATION
			}
		})

		if (existingToken) {
			await this.prismaService.token.delete({
				where: {
					id: existingToken.id,
					type: TokenType.REGISTRATION
				}
			})
		}

		const verificationToken = await this.prismaService.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.REGISTRATION
			}
		})

		return verificationToken
	}
}
