import { Injectable } from '@nestjs/common'
import { User } from '@prisma/__generated__'
import type { FileUpload } from 'graphql-upload/processRequest.mjs'

import { PrismaService } from '@/core/prisma/prisma.service'
import { StorageService } from '@/core/storage/storage.service'

@Injectable()
export class ProfileService {
	constructor(
		private readonly storageService: StorageService,
		private readonly prismaService: PrismaService
	) {}
	public async changeAvatar(user: User, file: FileUpload) {
		if (user.avatar) {
			await this.storageService.remove(user.avatar)
		}

		console.log(file)

		const chunks: Buffer[] = []

		for await (const chunk of file.createReadStream()) {
			chunks.push(chunk)
		}

		const buffer = Buffer.concat(chunks)
		const ext =
			file.mimetype === 'application/octet-stream'
				? file.filename.split('.').pop()
				: file.mimetype.split('/')[1]
		const fileName = `avatars/${user.id}.${ext}`

		await this.storageService.upload(buffer, fileName, `image/${ext}`)

		await this.storageService.remove(fileName)

		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				avatar: fileName
			}
		})

		return true
	}

	public async removeAvatar(user: User) {
		if (!user.avatar) {
			return
		}

		await this.storageService.remove(user.avatar)

		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				avatar: null
			}
		})

		return true
	}
}
