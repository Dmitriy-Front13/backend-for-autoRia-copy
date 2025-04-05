import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { MailModule } from '@/core/mail/mail.module'

import { AuthModule } from '../modules/auth/auth.module'
import { UserModule } from '../modules/user/user.module'
import { IS_DEV_ENV } from '../shared/utils/is-dev.util'

import { PrismaModule } from './prisma/prisma.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: !IS_DEV_ENV }),
		PrismaModule,
		AuthModule,
		UserModule,
		MailModule
	]
})
export class AppModule {}
