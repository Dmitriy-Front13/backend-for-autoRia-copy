import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { RegisterInput } from '../inputs/register.input'
import { AuthService } from '../services/auth.service'

@Resolver('Auth')
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}
	@Mutation(() => String)
	register(@Args('input') input: RegisterInput) {
		return this.authService.register(input)
	}
}
