import { ConfigService } from '@nestjs/config'

import { TypeOptions } from '../oauth/oauth.constants'
import { GoogleProvider } from '../oauth/services/google.provider'

export const getOAuthConfig = async (
	configService: ConfigService
): Promise<TypeOptions> => ({
	baseUrl: configService.getOrThrow<string>('APPLICATION_URL'),
	services: [
		new GoogleProvider({
			client_id: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
			client_secret: configService.getOrThrow<string>(
				'GOOGLE_CLIENT_SECRET'
			),
			scopes: ['email', 'profile']
		})
	]
})
