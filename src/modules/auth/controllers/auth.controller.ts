import {
	BadRequestException,
	Controller,
	Get,
	Param,
	Query,
	Req,
	Res,
	UseGuards
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response } from 'express'

import { OAuthGuard } from '../oauth/guards/oauth.guard'
import { OAuthService } from '../oauth/oauth.service'
import { AuthService } from '../services/auth.service'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
		private readonly oauthService: OAuthService
	) {}

	@UseGuards(OAuthGuard)
	@Get('/oauth/callback/:provider')
	public async callback(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Query('code') code: string,
		@Param('provider') provider: string
	) {
		if (!code) {
			throw new BadRequestException(
				'Не был предоставлен код авторизации.'
			)
		}

		await this.authService.extractProfileFromCode(req, provider, code)

		return res.redirect(
			`${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/dashboard/settings`
		)
	}

	@UseGuards(OAuthGuard)
	@Get('/oauth/connect/:provider')
	public async connect(@Param('provider') provider: string) {
		const providerInstance = this.oauthService.findByService(provider)

		return {
			url: providerInstance!.getAuthUrl()
		}
	}
}
