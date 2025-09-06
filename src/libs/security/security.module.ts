import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { DbModule } from '@/libs/db'
import { RedisModule } from '@/libs/redis'

import { PasswordService, TokenService } from './services'
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies'

@Module({
	imports: [JwtModule.register({}), DbModule, RedisModule],
	providers: [TokenService, AccessTokenStrategy, RefreshTokenStrategy, PasswordService],
	exports: [TokenService, PasswordService]
})
export class SecurityModule {}
