import { MailerService } from '@nestjs-modules/mailer'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { User } from '@prisma/generated'
import { render } from '@react-email/components'
import { Queue } from 'bullmq'

import { EmailVerificationTemplate } from './templates/email-verification.template'
import { ResetPasswordTemplate } from './templates/reset-password.template'

@Injectable()
export class MailService {
	public constructor(
		private readonly mailerService: MailerService,
		@InjectQueue('mail') private readonly queue: Queue
	) {}

	public async sendEmailVerification(user: User, token: string) {
		const html = await render(EmailVerificationTemplate({ user, token }))

		await this.queue.add('send-email', { email: user.email, subject: 'Email verification', html }, { removeOnComplete: true })

		return true
	}

	public async sendPasswordReset(user: User, token: string) {
		const html = await render(ResetPasswordTemplate({ user, token }))

		await this.queue.add('send-email', { email: user.email, subject: 'Password reset', html }, { removeOnComplete: true })

		return true
	}

	public sendMail(email: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to: email,
			subject,
			html
		})
	}
}
