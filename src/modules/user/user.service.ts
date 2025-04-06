import { Injectable, NotFoundException } from '@nestjs/common'
import { AuthMethod } from '@prisma/__generated__'
import { hash } from 'argon2'

import { PrismaService } from '@/core/prisma/prisma.service'

@Injectable()
export class UserService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findById(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: { id },
			include: { accounts: true }
		})
		if (!user)
			throw new NotFoundException(
				'User not found. Please check your credentials'
			)
		return user
	}

	public async findByEmail(email: string) {
		const user = await this.prismaService.user.findUnique({
			where: { email },
			include: { accounts: true }
		})
		return user
	}

	public async create(
		email: string,
		password: string,
		firstName: string,
		lastName: string,
		picture: string,
		method: AuthMethod
	) {
		const user = await this.prismaService.user.create({
			data: {
				email,
				password: password ? await hash(password) : '',
				firstName,
				lastName,
				picture,
				method
			},
			include: {
				accounts: true
			}
		})
		return user
	}
}
