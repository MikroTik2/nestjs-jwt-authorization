import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common'

import { RedisClient } from '@/config'

@Injectable()
export class RedisService implements OnModuleDestroy {
	public constructor(
		@Inject('redis')
		private readonly redis: RedisClient
	) {}

	public onModuleDestroy() {
		this.disconnect()
	}

	public disconnect() {
		this.redis.disconnect()
	}

	public async set(key: string, value: string) {
		return await this.redis.set(key, value)
	}

	public async get(key: string) {
		return await this.redis.get(key)
	}

	public async del(key: string) {
		return await this.redis.del(key)
	}

	public async setTokenToBlacklist(token: string, expiration: number) {
		return await this.redis.set(token, 'true', 'EX', expiration)
	}
}
