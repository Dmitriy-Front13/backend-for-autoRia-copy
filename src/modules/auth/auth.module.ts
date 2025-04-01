import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'

import { getRecaptchaConfig } from '@/config/recaptcha.config'
import { UserService } from '@/modules/user/user.service'

import { AuthController } from './controllers/auth.controller'
import { AuthService } from './services/auth.service'

@Module({
	imports: [
		UserService,
		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getRecaptchaConfig,
			inject: [ConfigService]
		})
	],
	controllers: [AuthController],
	providers: [AuthService]
})
export class AuthModule {}
