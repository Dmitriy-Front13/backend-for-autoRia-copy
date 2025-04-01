import { Module } from '@nestjs/common'

import { UserService } from '@/modules/user/user.service'

import { AuthController } from './controllers/auth.controller'
import { AuthService } from './services/auth.service'

@Module({
	imports: [UserService],
	controllers: [AuthController],
	providers: [AuthService]
})
export class AuthModule {}
