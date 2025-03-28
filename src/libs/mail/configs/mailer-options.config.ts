import { MailerOptions } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

export const getMailerConfig = async (config: ConfigService): Promise<MailerOptions> => ({
    transport: {
        host: config.get<string>("MAIL_HOST"),
        port: config.get<number>("MAIL_PORT"),
        secure: false,
        auth: {
            user: config.get<string>("MAIL_USER"),
            pass: config.get<string>("MAIL_PASS"),
        },
    },

    defaults: {
        from: `"MikrTik_2" <${config.get<string>("MAIL_USER")}>`,
    },
});
