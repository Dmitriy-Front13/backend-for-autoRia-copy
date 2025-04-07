import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, MinLength, Validate } from 'class-validator'

import { IsPasswordsMatchingConstraint } from '@/shared/decorators/is-passwords-matching-constraint.decorator'

@InputType()
export class NewPasswordInput {
	@IsString({ message: 'Password must be a string.' })
	@IsNotEmpty({ message: 'Password is required.' })
	@MinLength(6, {
		message: 'Password must be at least 6 characters long.'
	})
	@Field(() => String)
	password: string

	@IsString({ message: 'Password confirmation must be a string.' })
	@IsNotEmpty({ message: 'Password confirmation is required.' })
	@MinLength(6, {
		message: 'Password confirmation must be at least 6 characters long.'
	})
	@Validate(IsPasswordsMatchingConstraint, {
		message: 'Passwords do not match.'
	})
	@Field(() => String)
	passwordRepeat: string

	@Field(() => String, {
		description: 'Token from email'
	})
	@IsString({ message: 'Token must be a string.' })
	@IsNotEmpty({ message: 'Token is required.' })
	token: string
}
