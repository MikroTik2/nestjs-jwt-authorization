import { Expose, Type } from "class-transformer";
import { ResponseUserDto } from "@/core/users/dtos";

export class AuthResponseDto {
    @Expose()
    @Type(() => ResponseUserDto)
    user: ResponseUserDto;

    @Expose()
    accessToken: string;

    @Expose()
    refreshToken: string;
}
