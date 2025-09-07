import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ConfirmationDto {
    @ApiProperty({ description: "Токен для підтвердження дії.", example: "vEXwTKFNOedOkl397z2uQLcv2Gl6Luo7ptZzF4M01-PsZrw9zOXEo1hMsx_KqkTGr" })
    @IsString({ message: "Токен має бути рядком." })
    @IsNotEmpty({ message: "Поле токен не може бути порожнім." })
    token: string;
}
