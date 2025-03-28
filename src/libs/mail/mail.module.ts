import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { MailService } from "./services";
import { getMailerConfig } from "./configs";

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: getMailerConfig,
            inject: [ConfigService],
        }),
    ],

    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
