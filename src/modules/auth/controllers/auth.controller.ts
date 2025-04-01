import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'

import { RegisterDto } from './dto/register.dto'
import { AuthService } from './services/auth.service'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@HttpCode(HttpStatus.OK)
	public async register(@Body() dto: RegisterDto) {
		this.authService.register(dto)
	}
}
