import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt'

import { UserPayload } from '@/common/interfaces'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { RedisService } from '@/infra/redis/redis.service'

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access-token-strategy') {
	public constructor(
		private readonly configService: ConfigService,
		private readonly redisService: RedisService,
		private readonly prismaService: PrismaService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('ACCESS_SECRET'),
			algorithms: ['HS256'],
			passReqToCallback: true
		} as StrategyOptionsWithRequest)
	}

	public async validate(req: Request, payload: UserPayload) {
		const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req)
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
			sub: user.id,
			email: user.email
		}
	}
}
