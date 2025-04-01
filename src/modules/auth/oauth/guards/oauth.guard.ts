import {
	CanActivate,
	ExecutionContext,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Request } from 'express'

import { OAuthService } from '../oauth.service'

@Injectable()
export class OAuthGuard implements CanActivate {
	public constructor(private readonly providerService: OAuthService) {}

	public canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest() as Request

		const provider = request.params.provider

		const providerInstance = this.providerService.findByService(provider)

		if (!providerInstance) {
			throw new NotFoundException(
				`Provider "${provider}" not found. Please check the correctness of the entered data.`
			)
		}

		return true
	}
}
