import type { Provider } from "@nestjs/common";
import { getRedisConfig } from "../configs";
import { REDIS_CLIENT } from "../constants";
import { ConfigService } from "@nestjs/config";

export const redisClientProvider: Provider = {
    useFactory: getRedisConfig,
    inject: [ConfigService],
    provide: REDIS_CLIENT,
};
