import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserModel {
	@Field(() => String)
	id: string

	@Field(() => String)
	email: string

	@Field(() => String)
	firstName: string

	@Field(() => String, { nullable: true })
	lastName?: string

	@Field(() => String, { nullable: true })
	picture?: string

	@Field(() => Boolean)
	isTwoFactorEnabled: boolean
}
