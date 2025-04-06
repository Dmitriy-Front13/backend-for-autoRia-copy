import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from 'class-validator'

import { RegisterInput } from '@/modules/auth/inputs/register.input'

@ValidatorConstraint({ name: 'IsPasswordsMatching', async: false })
export class IsPasswordsMatchingConstraint
	implements ValidatorConstraintInterface
{
	public validate(passwordRepeat: string, args: ValidationArguments) {
		const obj = args.object as RegisterInput
		return obj.password === passwordRepeat
	}

	public defaultMessage(validationArguments?: ValidationArguments) {
		return 'Passwords do not match'
	}
}
