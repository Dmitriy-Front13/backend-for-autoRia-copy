import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { Request, Response } from 'express'

import { MessageResponse } from '@/shared/models/message-response.model'

import { RegisterInput } from '../inputs/register.input'
import { RequestRegisterInput } from '../inputs/request-register.input'
import { AuthService } from '../services/auth.service'

@Resolver('Auth')
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}
	@Mutation(() => String)
	register(
		@Args('input') input: RegisterInput,
		@Context() context: { req: Request }
	) {
		return this.authService.register(context.req, input)
	}

	@Mutation(() => MessageResponse)
	requestRegister(@Args('input') input: RequestRegisterInput) {
		return this.authService.requestRegister(input)
	}

	@Mutation(() => Boolean)
	async logout(
		@Context() context: { req: Request; res: Response }
	): Promise<boolean> {
		await this.authService.logout(context.req, context.res)
		return true
	}
}
