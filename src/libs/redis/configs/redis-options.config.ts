import { Redis } from "ioredis";
import { ConfigService } from "@nestjs/config";

export type RedisClient = Redis;

export const getRedisConfig = async (config: ConfigService): Promise<RedisClient> => {
    return Promise.resolve(
        new Redis({
            host: config.get<string>("REDIS_HOST"),
            port: config.get<number>("REDIS_PORT"),
            username: config.get<string>("REDIS_USER"),
            password: config.get<string>("REDIS_PASSWORD"),
            db: 0,
        }),
    );
};
