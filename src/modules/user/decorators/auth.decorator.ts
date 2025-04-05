import { applyDecorators, UseGuards } from '@nestjs/common'
import { UserRole } from '@prisma/__generated__'

import { GqlAuthGuard } from '@/shared/guards/auth.guard'
import { RolesGuard } from '@/shared/guards/roles.guard'

import { Roles } from './roles.decorator'

export function Authorization(...roles: UserRole[]) {
	if (roles.length > 0) {
		return applyDecorators(
			Roles(...roles),
			UseGuards(GqlAuthGuard, RolesGuard)
		)
	}

	return applyDecorators(UseGuards(GqlAuthGuard))
}
