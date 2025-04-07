import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { PrismaService } from '@/core/prisma/prisma.service'

@Injectable()
export class CronService {
	private readonly logger = new Logger(CronService.name)
	constructor(private readonly prismaService: PrismaService) {}
	@Cron('0 * * * *')
	async deleteExpiredTokens() {
		this.logger.log('🧹 Starting expired token cleanup...')
		await this.prismaService.token.deleteMany({
			where: {
				expiresIn: { lt: new Date() }
			}
		})
		this.logger.log('✅ Token cleanup completed.')
	}
}
