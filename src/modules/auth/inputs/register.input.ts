import { Field, InputType } from '@nestjs/graphql'
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MinLength,
	Validate
} from 'class-validator'

import { IsPasswordsMatchingConstraint } from '@/shared/decorators/is-passwords-matching-constraint.decorator'

@InputType()
export class RegisterInput {
	@Field()
	@IsString({ message: 'firstName must be a string.' })
	@IsNotEmpty({ message: 'firstName is required.' })
	firstName: string

	@Field()
	@IsString({ message: 'lastName must be a string.' })
	@IsNotEmpty({ message: 'lastName is required.' })
	lastName: string

	@Field(() => String, {
		description: 'code from email'
	})
	@IsString({ message: 'code must be a string.' })
	@IsNotEmpty({ message: 'code is required.' })
	code: string

	@Field(() => String)
	@IsString({ message: 'Password must be a string.' })
	@IsNotEmpty({ message: 'Password is required.' })
	@MinLength(6, {
		message: 'Password must be at least 6 characters long.'
	})
	password: string

	@Field(() => String)
	@IsString({ message: 'Password confirmation must be a string.' })
	@IsNotEmpty({ message: 'Password confirmation is required.' })
	@MinLength(6, {
		message: 'Password confirmation must be at least 6 characters long.'
	})
	@Validate(IsPasswordsMatchingConstraint, {
		message: 'Passwords do not match.'
	})
	passwordRepeat: string
}
