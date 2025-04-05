import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'

import { getRecaptchaConfig } from '@/modules/auth/config/recaptcha.config'

import { UserModule } from '../user/user.module'

import { getOAuthConfig } from './config/oauth.config'
import { AuthController } from './controllers/auth.controller'
import { OAuthModule } from './oauth/oauth.module'
import { AuthService } from './services/auth.service'
import { EmailConfirmationService } from './services/email-confirmation.service'
import { SessionService } from './services/session.service'

@Module({
	imports: [
		UserModule,
		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getRecaptchaConfig,
			inject: [ConfigService]
		}),
		OAuthModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getOAuthConfig,
			inject: [ConfigService]
		})
	],
	controllers: [AuthController],
	providers: [AuthService, EmailConfirmationService, SessionService]
})
export class AuthModule {}
