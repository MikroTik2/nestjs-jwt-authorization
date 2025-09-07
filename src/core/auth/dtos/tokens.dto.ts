import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TokensDto {
    @ApiProperty({
        default:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjNlNWNhOGQ2MTE3OTM4ZMZ1ODVhYzciLCJlbWFpbCI6IlZsYSRAZ21haWwxLmNvbSIsImlhdCI2MTcxNTQ1NjA4OSwiZXhwIwdawdajoxNzE2MDYwODg5fQ.AaHdG7qL3CciSQI82lTLWM7MHhR43tKTgFoWEOuYtvY",
    })
    @IsNotEmpty({ message: "Токен доступу не може бути порожнім" })
    @IsString({ message: "Токен доступу повинен бути рядком" })
    accessToken: string;

    @ApiProperty({
        default:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjNlNWNhOGQ2MTE3OTM4ATZ9ODVhYzciLCJlbWFpbCI6IlZsYWRAZ21haWwxLmNvbSIsImlhdCI6MTcxNTQ1NjA4OSwiZXhwIwdawdajoxNzE2MDYwODg5fQ.AaHdG7qL3CciSQI82lTLWM7MHhR43tKTgFoWEOuYtvY",
    })
    @IsNotEmpty({ message: "Токен оновлення не може бути порожнім" })
    @IsString({ message: "Токен оновлення повинен бути рядком" })
    refreshToken: string;
}
