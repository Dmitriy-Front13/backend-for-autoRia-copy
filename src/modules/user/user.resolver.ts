import { Context, Query, Resolver } from '@nestjs/graphql'

import { Authorization } from './decorators/auth.decorator'
import { Authorized } from './decorators/authorized.decorator'
import { UserModel } from './user.model'
import { UserService } from './user.service'

@Resolver()
export class UserResolver {
	constructor(private readonly userService: UserService) {}
	@Authorization()
	@Query(() => UserModel, { name: 'findProfile' })
	public async me(@Authorized('id') id: string) {
		return this.userService.findById(id)
	}
}
