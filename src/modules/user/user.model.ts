import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserModel {
	@Field(() => String)
	email: string
	@Field(() => String)
	displayName: string
	@Field(() => String)
	picture: string
}
