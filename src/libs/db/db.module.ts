import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema, Token, TokenSchema } from "./models";
import { UserRepository, TokenRepository } from "./repositories";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>("DB_URI"),
                retryAttempts: 2,
                retryDelay: 2000,
            }),

            inject: [ConfigService],
        }),

        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Token.name, schema: TokenSchema },
        ]),
    ],

    providers: [UserRepository, TokenRepository],
    exports: [MongooseModule, UserRepository, TokenRepository],
})
export class DbModule {}
