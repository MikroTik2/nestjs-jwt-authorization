import {
	Body,
	Heading,
	Link,
	Tailwind,
	Text
} from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react';

interface ResetPasswordTemplateProps {
	domain: string;
	token: string;
}

/**
 * Generates an email template for password reset.
 * The reset link is created from the domain and token. 
 * The email informs that the link is valid for 1 hour.
 * 
 * @param {ResetPasswordTemplateProps} props - Domain and token for generating the link.
 * @returns {JSX.Element} The generated email template.
 */
export function ResetPasswordTemplate({ domain, token }: ResetPasswordTemplateProps) {
	const resetLink = `${domain}/auth/new-password?token=${token}`;

	return (
		<Tailwind>
			<Html>
				<Body className='text-black'>
					<Heading>Password Reset</Heading>
					<Text>
						Hello! You have requested to reset your password. Please click the following link to create a new password:
					</Text>
					<Link href={resetLink}>Confirm Password Reset</Link>
					<Text>
						This link is valid for 1 hour. If you did not request a password reset, please ignore this message.
					</Text>
				</Body>
			</Html>
		</Tailwind>
	);
}
