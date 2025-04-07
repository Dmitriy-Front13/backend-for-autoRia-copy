import { Field, InputType } from '@nestjs/graphql'
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength
} from 'class-validator'

@InputType()
export class LoginInput {
	@IsString({ message: 'Email must be a string.' })
	@IsEmail({}, { message: 'Invalid email format.' })
	@IsNotEmpty({ message: 'Email is required.' })
	@Field(() => String)
	email: string

	@IsString({ message: 'Password must be a string.' })
	@IsNotEmpty({ message: 'Password field cannot be empty.' })
	@MinLength(6, { message: 'Password must be at least 6 characters long.' })
	@Field(() => String)
	password: string

	@IsOptional()
	@IsString()
	@Field(() => String, { nullable: true, description: 'code 2FA' })
	code: string
}
