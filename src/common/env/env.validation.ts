import { plainToInstance } from "class-transformer";
import { IsNumber, IsNotEmpty, IsString, validateSync, Min, Max } from "class-validator";

class EnvironmentVariables {
    @IsString()
    @IsNotEmpty()
    NODE_ENV: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Max(65535)
    APPLICATION_PORT: number;

    @IsString()
    @IsNotEmpty()
    APPLICATION_URL: string;

    @IsString()
    @IsNotEmpty()
    ALLOWED_ORIGIN: string;

    @IsString()
    @IsNotEmpty()
    ACCESS_SECRET: string;

    @IsString()
    @IsNotEmpty()
    REFRESH_SECRET: string;

    @IsNumber()
    @IsNotEmpty()
    ACCESS_EXPIRE_TIME: number;

    @IsNumber()
    @IsNotEmpty()
    REFRESH_EXPIRE_TIME: number;

    @IsString()
    @IsNotEmpty()
    DB_URI: string;

    @IsString()
    @IsNotEmpty()
    DB_HOST: string;

    @IsString()
    @IsNotEmpty()
    DB_NAME: string;

    @IsString()
    @IsNotEmpty()
    DB_PASSWORD: string;

    @IsString()
    @IsNotEmpty()
    DB_USER: string;

    @IsString()
    @IsNotEmpty()
    CLOUDINARY_API_KEY: string;

    @IsString()
    @IsNotEmpty()
    CLOUDINARY_API_NAME: string;

    @IsString()
    @IsNotEmpty()
    CLOUDINARY_API_SECRET: string;

    @IsString()
    @IsNotEmpty()
    REDIS_USER: string;

    @IsString()
    @IsNotEmpty()
    REDIS_PASSWORD: string;

    @IsString()
    @IsNotEmpty()
    REDIS_HOST: string;

    @IsString()
    @IsNotEmpty()
    REDIS_PORT: string;

    @IsString()
    @IsNotEmpty()
    REDIS_URI: string;

    @IsString()
    @IsNotEmpty()
    MAIL_USER: string;

    @IsString()
    @IsNotEmpty()
    MAIL_PASS: string;

    @IsString()
    @IsNotEmpty()
    MAIL_SERVICE: string;

    @IsString()
    @IsNotEmpty()
    MAIL_HOST: string;

    @IsNumber()
    @IsNotEmpty()
    MAIL_PORT: number;

    @IsString()
    @IsNotEmpty()
    GOOGLE_CLIENT_ID: string;

    @IsString()
    @IsNotEmpty()
    GOOGLE_CLIENT_SECRET: string;

    @IsString()
    @IsNotEmpty()
    GITHUB_CLIENT_ID: string;

    @IsString()
    @IsNotEmpty()
    GITHUB_CLIENT_SECRET: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}
