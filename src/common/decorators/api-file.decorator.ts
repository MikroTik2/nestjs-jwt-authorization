import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

export const ApiFile =
	(options?: ApiPropertyOptions): PropertyDecorator =>
	(target: object, propertyKey: string | symbol) => {
		if (options?.isArray) {
			ApiProperty({
				type: 'array',
				items: {
					type: 'string',
					format: 'binary'
				},
				description: options.description
			})(target, propertyKey)
		} else if (options) {
			ApiProperty({
				type: 'string',
				format: 'binary',
				description: options.description
			})(target, propertyKey)
		}
	}
