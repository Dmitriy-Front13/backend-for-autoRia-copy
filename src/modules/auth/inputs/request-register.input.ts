import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class RequestRegisterInput {
	@Field()
	@IsString({ message: 'Email must be a string.' })
	@IsEmail({}, { message: 'Invalid email format.' })
	@IsNotEmpty({ message: 'Email is required.' })
	email: string
}
