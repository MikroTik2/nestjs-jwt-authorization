import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class TokenService {
	public constructor(
		private readonly jwtService: JwtService,
		private readonly config: ConfigService
	) {}

	public async createAccessToken<T>(payload: { sub: T }): Promise<string> {
		return await this.jwtService.signAsync(payload, {
			expiresIn: this.config.get<string>('ACCESS_EXPIRE_TIME'),
			secret: this.config.get<string>('ACCESS_SECRET')
		})
	}

	public async createRefreshToken<T>(payload: { sub: T }): Promise<string> {
		return await this.jwtService.signAsync(payload, {
			expiresIn: this.config.get<string>('REFRESH_EXPIRE_TIME'),
			secret: this.config.get<string>('REFRESH_SECRET')
		})
	}

	public verifyAccessToken(token: string): object {
		return this.jwtService.verify(token, {
			secret: this.config.get<string>('ACCESS_SECRET')
		})
	}

	public verifyRefreshToken(token: string): object {
		return this.jwtService.verify(token, {
			secret: this.config.get<string>('REFRESH_SECRET')
		})
	}
}
