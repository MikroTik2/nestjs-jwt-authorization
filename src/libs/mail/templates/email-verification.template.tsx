import { Body, Heading, Link, Tailwind, Text } from "@react-email/components"
import { Html } from "@react-email/html"
import * as React from 'react'

interface EmailVerificationTemplateProps {
	domain: string
	token: string
}

/**
 * Generates an email template for user email verification.
 * The confirmation link is created from the domain and token. 
 * The email informs that the link is valid for 1 hour.
 * 
 * @param {EmailVerificationTemplateProps} props - Domain and token for generating the link.
 * @returns {JSX.Element} The generated email template.
 */
export function EmailVerificationTemplate({
	domain,
	token
}: EmailVerificationTemplateProps) {
	const confirmLink = `${domain}/auth/new-verification?token=${token}`

	return (
		<Tailwind>
			<Html>
				<Body className='text-black'>
					<Heading>Email Confirmation</Heading>
					<Text>
						Hello! To confirm your email address, please click the following link:
					</Text>
					<Link href={confirmLink}>Confirm Email</Link>
					<Text>
						This link is valid for 1 hour. If you did not request confirmation, please ignore this message.
					</Text>
				</Body>
			</Html>
		</Tailwind>
	)
}
