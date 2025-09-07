import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({ description: "Електронна пошта користувача", example: "denis@example.com" })
    @IsNotEmpty({ message: "Електронна пошта не може бути порожньою" })
    @IsEmail({}, { message: "Невірний формат електронної пошти" })
    email: string;

    @ApiProperty({ description: "Пароль користувача", example: "securePassword123" })
    @IsNotEmpty({ message: "Пароль не може бути порожнім" })
    @IsString({ message: "Пароль повинен бути рядком" })
    password: string;
}
