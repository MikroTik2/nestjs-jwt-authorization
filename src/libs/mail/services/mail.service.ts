import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { render } from "@react-email/components";

import { ResetPasswordTemplate } from "../templates/reset-password.template";
import { ConfirmationTemplate } from "../templates/confirmation.template";

@Injectable()
export class MailService {
    public constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {}

    public async sendPasswordResetEmail(email: string, token: string) {
        const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGIN");
        const html = await render(ResetPasswordTemplate({ domain, token }));

        return this.sendMail(email, "Скидання пароля", html);
    }

    public async sendConfirmationEmail(email: string, token: string) {
        const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGIN");
        const html = await render(ConfirmationTemplate({ domain, token }));

        return this.sendMail(email, "Підтвердження електронної пошти", html);
    }

    private sendMail(email: string, subject: string, html: string) {
        return this.mailerService.sendMail({
            to: email,
            subject,
            html,
        });
    }
}
