import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ENUM_AUTH_METHOD, ENUM_USER_ROLES } from "@/common/enums";
import { ApiFile } from "@/common/decorators";
import { Type } from "class-transformer";

interface IImage {
    public_id: string;
    url: string;
}

export class CreateUserDto {
    @ApiProperty({ description: "Ім'я користувача", example: "Денис" })
    @IsNotEmpty({ message: "Ім'я не може бути порожнім" })
    @IsString({ message: "Ім'я має бути рядком" })
    name: string;

    @ApiProperty({ description: "Електронна пошта користувача", example: "denis.petrenko@example.com" })
    @IsNotEmpty({ message: "Електронна пошта не може бути порожньою" })
    @IsEmail({}, { message: "Невірний формат електронної пошти" })
    email: string;

    @ApiProperty({ description: "Пароль користувача", example: "password123" })
    @IsNotEmpty({ message: "Пароль не може бути порожнім" })
    @IsString({ message: "Пароль має бути рядком" })
    password: string;

    @ApiProperty({ description: "Роль користувача", example: ENUM_USER_ROLES.USER })
    @IsNotEmpty({ message: "Роль не може бути порожньою" })
    @IsEnum(ENUM_USER_ROLES, { message: "Невірна роль" })
    role: string;

    @ApiProperty({ description: "Статус верифікації користувача", example: false, default: false })
    @IsNotEmpty({ message: "Статус верифікації не може бути порожнім" })
    @IsBoolean({ message: "Статус верифікації має бути логічним значенням" })
    @Type(() => Boolean)
    is_verified: boolean;

    @ApiFile({ isArray: false, description: "Аватарка користувача" })
    @IsOptional()
    avatar?: Express.Multer.File | IImage;

    @ApiProperty({ description: "Метод користувача", example: ENUM_AUTH_METHOD.CREDENTIALS })
    @IsString({ message: "Метод має бути рядком" })
    @IsNotEmpty({ message: "Метод не може бути порожнім" })
    @IsEnum(ENUM_AUTH_METHOD, { message: "Невірний метод" })
    method: string;
}
