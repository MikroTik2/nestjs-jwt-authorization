import { Module } from "@nestjs/common";
import { AuthController } from "./controllers";
import { AuthService } from "./services";
import { UserModule } from "@/core/users";
import { SecurityModule } from "@/libs/security";
import { DbModule } from "@/libs/db";
import { RedisModule } from "@/libs/redis";
import { MailModule } from "@/libs/mail";
import { OAuthModule } from "@/libs/oauth";

@Module({
    imports: [UserModule, OAuthModule, SecurityModule, DbModule, MailModule, RedisModule],

    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
