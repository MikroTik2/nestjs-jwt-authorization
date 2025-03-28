import { Body, Heading, Link, Tailwind, Text } from "@react-email/components"
import { Html } from "@react-email/html"
import * as React from 'react'

interface ConfirmationTemplateProps {
	domain: string
	token: string
}

export function ConfirmationTemplate({
	domain,
	token
}: ConfirmationTemplateProps) {
	const confirmLink = `${domain}/auth/new-verification?token=${token}`

	return (
		<Tailwind>
			<Html>
				<Body className='text-black'>
					<Heading>Підтвердження електронної пошти</Heading>
					<Text>
						Привіт! Щоб підтвердити свою електронну пошту, будь ласка, перейдіть за наступним посиланням:
					</Text>
					<Link href={confirmLink}>Підтвердити пошту</Link>
					<Text>
						Це посилання дійсне протягом 1 години. Якщо ви не запитували підтвердження, просто проігноруйте це повідомлення.
					</Text>
				</Body>
			</Html>
		</Tailwind>
	)
}