import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MinLength } from "class-validator";

export class ChangePasswordDto {
    @ApiProperty({ description: "Старий пароль", example: "securePassword123" })
    @IsString({ message: "Старий пароль повинен бути рядком" })
    oldPassword: string;

    @ApiProperty({ description: "Новий пароль", example: "newPassword123" })
    @IsString({ message: "Новий пароль повинен бути рядком" })
    @MinLength(6, { message: "Новий пароль повинен містити не менше 6 символів" })
    @Matches(/^(?=.*[0-9])/, { message: "Пароль повинен містити хоча б одну цифру" })
    newPassword: string;
}
