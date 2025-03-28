import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterDto {
    @ApiProperty({
        description: "Ім'я користувача",
        example: "Денис",
    })
    @IsString({ message: "Ім'я повинно бути рядком" })
    @IsNotEmpty({ message: "Ім'я користувача не може бути порожнім" })
    name: string;

    @ApiProperty({
        description: "Електронна пошта",
        example: "denis@example.com",
    })
    @IsEmail({}, { message: "Невірний формат електронної пошти" })
    @IsNotEmpty({ message: "Електронна пошта не може бути порожньою" })
    email: string;

    @ApiProperty({
        description: "Пароль",
        example: "securePassword123",
    })
    @IsString({ message: "Пароль повинен бути рядком" })
    @IsNotEmpty({ message: "Пароль не може бути порожнім" })
    password: string;
}
