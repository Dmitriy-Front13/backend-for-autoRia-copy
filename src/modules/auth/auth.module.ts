import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { UserModule } from '../user/user.module'

import { getOAuthConfig } from './config/oauth.config'
import { AuthController } from './controllers/auth.controller'
import { OAuthModule } from './oauth/oauth.module'
import { AuthResolver } from './resolvers/auth.resolver'
import { AuthService } from './services/auth.service'
import { EmailConfirmationService } from './services/email-confirmation.service'
import { ResetPasswordService } from './services/reset-password.service'

@Module({
	imports: [
		UserModule,
		OAuthModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getOAuthConfig,
			inject: [ConfigService]
		})
	],
	controllers: [AuthController],
	providers: [AuthService, EmailConfirmationService, AuthResolver, ResetPasswordService]
})
export class AuthModule {}
