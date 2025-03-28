import { Body, Heading, Link, Tailwind, Text } from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react';

interface ResetPasswordTemplateProps {
	domain: string;
	token: string;
}

export function ResetPasswordTemplate({ domain, token }: ResetPasswordTemplateProps) {
	const resetLink = `${domain}/auth/reset-token?token=${token}`;

	return (
		<Tailwind>
			<Html>
				<Body className='text-black'>
					<Heading>Скидання пароля</Heading>
					<Text>
						Привіт! Ви запитали скидання пароля. Будь ласка, перейдіть за наступним посиланням, щоб створити новий пароль:
					</Text>
					<Link href={resetLink}>Підтвердити скидання пароля</Link>
					<Text>
						Це посилання дійсне протягом 1 години. Якщо ви не запитували скидання пароля, просто проігноруйте це повідомлення.
					</Text>
				</Body>
			</Html>
		</Tailwind>
	);
}