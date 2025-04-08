import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { User } from '@prisma/__generated__'
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs'
import type { FileUpload } from 'graphql-upload/processRequest.mjs'

import { FileValidationPipe } from '@/shared/pipes/file-validation.pipe'

import { Authorization } from '../user/decorators/auth.decorator'
import { Authorized } from '../user/decorators/authorized.decorator'

import { ProfileService } from './profile.service'

@Resolver()
export class ProfileResolver {
	constructor(private readonly profileService: ProfileService) {}
	@Authorization()
	@Mutation(() => Boolean)
	public async changeAvatar(
		@Authorized() user: User,
		@Args('avatar', { type: () => GraphQLUpload }, FileValidationPipe)
		avatar: FileUpload
	) {
		return this.profileService.changeAvatar(user, avatar)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeProfileAvatar' })
	public async removeAvatar(@Authorized() user: User) {
		return this.profileService.removeAvatar(user)
	}
}
