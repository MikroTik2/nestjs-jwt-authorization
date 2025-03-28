import { Module } from "@nestjs/common";
import { RedisService } from "./services";
import { redisClientProvider } from "./providers";

@Module({
    providers: [redisClientProvider, RedisService],
    exports: [RedisService],
})
export class RedisModule {}
