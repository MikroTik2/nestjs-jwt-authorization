import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { getRedisConfig } from '@/config/redis.config'

import { RedisService } from './redis.service'

@Module({
	imports: [ConfigModule],
	providers: [
		{
			provide: 'redis',
			useFactory: getRedisConfig,
			inject: [ConfigService]
		},
		RedisService
	],
	exports: [RedisService]
})
export class RedisModule {}
