import { Controller, Get, Patch, Param, Body, Delete, HttpStatus, UseGuards, HttpCode } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UserService } from "../services";
import { UpdateUserDto, ResponseUserDto } from "../dtos";
import { AccessTokenAuthGuard } from "@/libs/security/guards";
import { AuthUser, Roles, Serialize } from "@/common/decorators";
import { IUserPayload } from "@/common/interfaces";
import { RoleGuard } from "@/common/guards";
import { ENUM_USER_ROLES } from "@/common/enums";

@Controller("users")
export class UserController {
    public constructor(private readonly userService: UserService) {}

    @Get("all")
    @Serialize(ResponseUserDto)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Отримати всіх користувачів" })
    @ApiResponse({ status: HttpStatus.OK, description: "Користувачів знайдено" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Внутрішня помилка сервера" })
    public async findAll() {
        return this.userService.findAll();
    }

    @Get("/profile")
    @Serialize(ResponseUserDto)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Отримати інформацію про власний профиль" })
    @ApiResponse({ status: HttpStatus.OK, description: "Інформація про профиль знайдена" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Помилка сервера" })
    @UseGuards(AccessTokenAuthGuard)
    public async getProfile(@AuthUser() user: IUserPayload) {
        return this.userService.findById(user.sub);
    }

    @Get("by-id/:id")
    @Serialize(ResponseUserDto)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Отримати деталі користувача за ID" })
    @ApiResponse({ status: HttpStatus.OK, description: "Деталі користувача знайдено" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Внутрішня помилка сервера" })
    public async findById(@Param("id") id: string) {
        return this.userService.findById(id);
    }

    @Patch(":id")
    @Serialize(ResponseUserDto)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Оновити деталі користувача" })
    @ApiResponse({ status: HttpStatus.OK, description: "Деталі користувача оновлено" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Внутрішня помилка сервера" })
    @UseGuards(AccessTokenAuthGuard)
    public async update(@AuthUser() user: IUserPayload, @Body() dto: UpdateUserDto) {
        return this.userService.update(user.sub, dto);
    }

    @Delete(":id")
    @Serialize(ResponseUserDto)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Видалити користувача" })
    @ApiResponse({ status: HttpStatus.OK, description: "Користувача видалено" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Користувача не знайдено" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Внутрішня помилка сервера" })
    @UseGuards(AccessTokenAuthGuard, RoleGuard)
    @Roles(ENUM_USER_ROLES.ADMIN)
    public async delete(@Param("id") id: string) {
        return this.userService.delete(id);
    }
}
