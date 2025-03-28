import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TokenService, PasswordService } from "./services";
import { AccessTokenStrategy, RefreshTokenStrategy } from "./strategies";
import { RedisModule } from "@/libs/redis";
import { DbModule } from "@/libs/db";

@Module({
    imports: [JwtModule.register({}), DbModule, RedisModule],
    providers: [TokenService, AccessTokenStrategy, RefreshTokenStrategy, PasswordService],
    exports: [TokenService, PasswordService],
})
export class SecurityModule {}
