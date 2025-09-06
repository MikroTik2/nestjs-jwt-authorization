import { DocumentBuilder } from '@nestjs/swagger'

export function getSwaggerConfig() {
	return new DocumentBuilder().setTitle('Blog API').setDescription('API for Blog platform').setVersion('1.0.0').build()
}
