import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
    @ApiProperty({ description: "Адреса електронної пошти користувача", example: "user@example.com" })
    @IsEmail({}, { message: "Введіть коректну адресу електронної пошти." })
    @IsNotEmpty({ message: "Поле email не може бути порожнім." })
    email: string;
}
