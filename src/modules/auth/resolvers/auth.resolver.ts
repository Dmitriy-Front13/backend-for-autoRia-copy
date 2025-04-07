import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { Request, Response } from 'express'

import { Authorization } from '@/modules/user/decorators/auth.decorator'
import { MessageResponse } from '@/shared/models/message-response.model'

import { LoginInput } from '../inputs/login.input'
import { NewPasswordInput } from '../inputs/new-password.input'
import { RegisterInput } from '../inputs/register.input'
import { RequestRegisterInput } from '../inputs/request-register.input'
import { ResetPasswordInput } from '../inputs/reset-password.input'
import { AuthService } from '../services/auth.service'
import { ResetPasswordService } from '../services/reset-password.service'

@Resolver('Auth')
export class AuthResolver {
	constructor(
		private readonly authService: AuthService,
		private readonly resetPasswordService: ResetPasswordService
	) {}

	@Mutation(() => String)
	login(
		@Args('input') input: LoginInput,
		@Context() context: { req: Request }
	) {
		return this.authService.login(context.req, input)
	}

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

	@Authorization()
	@Mutation(() => Boolean)
	async logout(
		@Context() context: { req: Request; res: Response }
	): Promise<boolean> {
		await this.authService.logout(context.req, context.res)
		return true
	}

	@Mutation(() => Boolean)
	async requestResetPassword(@Args('input') input: ResetPasswordInput) {
		return this.resetPasswordService.resetPassword(input)
	}
	@Mutation(() => Boolean)
	async resetPassword(@Args('input') input: NewPasswordInput) {
		return this.resetPasswordService.newPassword(input)
	}
}
