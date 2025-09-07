import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validate } from "@/common/env";

import { CachingModule } from "@/libs/cache";
import { RedisModule } from "@/libs/redis";
import { MailModule } from "@/libs/mail";
import { DbModule } from "@/libs/db";

import { UserModule } from "@/core/users";
import { AuthModule } from "@/core/auth";
import { CloudinaryModule } from "./libs/cloudinary";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate,
        }),

        UserModule,
        AuthModule,

        CachingModule,
        RedisModule,
        MailModule,
        DbModule,
        CloudinaryModule,
    ],
})
export class AppModule {}
