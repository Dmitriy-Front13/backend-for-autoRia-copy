import { type ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { MailModule } from '@/core/mail/mail.module'
import { CronModule } from '@/modules/cron/cron.module'
import { ProfileModule } from '@/modules/profile/profile.module'

import { AuthModule } from '../modules/auth/auth.module'
import { UserModule } from '../modules/user/user.module'
import { IS_DEV_ENV } from '../shared/utils/is-dev.util'

import { getGraphQLConfig } from './graphql/graphql.config'
import { PrismaModule } from './prisma/prisma.module'
import { StorageModule } from './storage/storage.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: !IS_DEV_ENV }),
		GraphQLModule.forRoot<ApolloDriverConfig>(getGraphQLConfig()),
		PrismaModule,
		AuthModule,
		UserModule,
		PrismaModule,
		ProfileModule,
		MailModule,
		CronModule,
		StorageModule
	]
})
export class AppModule {}
