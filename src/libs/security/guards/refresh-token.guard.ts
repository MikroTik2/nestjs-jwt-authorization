import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class RefreshTokenAuthGuard extends AuthGuard('refresh-token-strategy') {
	canActivate(context: ExecutionContext) {
		return super.canActivate(context)
	}

	handleRequest(err, user) {
		if (err || !user) {
			throw err ?? new ForbiddenException()
		}
		return user
	}
}
