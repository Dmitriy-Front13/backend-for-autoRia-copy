import { DynamicModule, Module } from '@nestjs/common'

import {
	ProviderOptionsSymbol,
	TypeAsyncOptions,
	TypeOptions
} from './oauth.constants'
import { OAuthService } from './oauth.service'

@Module({})
export class OAuthModule {
	public static register(options: TypeOptions): DynamicModule {
		return {
			module: OAuthModule,
			providers: [
				{
					useValue: options.services,
					provide: ProviderOptionsSymbol
				},
				OAuthService
			],
			exports: [OAuthService]
		}
	}

	public static registerAsync(options: TypeAsyncOptions): DynamicModule {
		return {
			module: OAuthModule,
			imports: options.imports,
			providers: [
				{
					useFactory: options.useFactory,
					provide: ProviderOptionsSymbol,
					inject: options.inject
				},
				OAuthService
			],
			exports: [OAuthService]
		}
	}
}
