import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt'

import { UserPayload } from '@/common/interfaces'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { RedisService } from '@/infra/redis/redis.service'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token-strategy') {
	public constructor(
		private readonly configService: ConfigService,
		private readonly redisService: RedisService,
		private readonly prismaService: PrismaService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('REFRESH_SECRET'),
			algorithms: ['HS256'],
			passReqToCallback: true
		} as StrategyOptionsWithRequest)
	}

	public async validate(req: Request, payload: UserPayload) {
		const token = ExtractJwt.fromBodyField('refreshToken')(req)
		const isTokenInBlacklist = await this.redisService.get(token)

		if (isTokenInBlacklist) {
			throw new UnauthorizedException('Token is in blacklist')
		}

		const user = await this.prismaService.user.findUnique({
			where: {
				id: payload.sub
			}
		})

		if (!user) {
			throw new UnauthorizedException('Please login to continue')
		}

		return {
			sub: payload.sub,
			email: payload.email
		}
	}
}
