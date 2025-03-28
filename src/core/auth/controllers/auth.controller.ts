import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "../services";
import { RegisterDto, LoginDto, ForgotPasswordDto, ChangePasswordDto, ResetPasswordDto, AuthResponseDto, ConfirmationDto, TokensDto } from "../dtos";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthUser, Serialize } from "@/common/decorators";
import { AccessTokenAuthGuard, RefreshTokenAuthGuard } from "@/libs/security/guards";
import { IUserPayload } from "@/common/interfaces";
import { Github, Google } from "@/libs/oauth/guards";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";

@Controller("auth")
export class AuthController {
    public constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    @Get("google")
    @UseGuards(Google)
    async googleAuth() {}

    @Get("github")
    @UseGuards(Github)
    async githubAuth() {}

    @Get("google/callback")
    @UseGuards(Google)
    async googleAuthCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const { refreshToken, accessToken } = await this.authService.validateOAuthLogin(req);
        return res.redirect(`${this.configService.get<string>("ALLOWED_ORIGIN")}/account/overview?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    }

    @Get("github/callback")
    @UseGuards(Github)
    async githubAuthCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const { refreshToken, accessToken } = await this.authService.validateOAuthLogin(req);
        return res.redirect(`${this.configService.get<string>("ALLOWED_ORIGIN")}/account/overview?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    }

    @Post("register")
    @HttpCode(HttpStatus.CREATED)
    @Serialize(AuthResponseDto)
    @ApiOperation({ summary: "Реєстрація нового користувача" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Користувач успішно зареєстрований" })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: "Користувач вже існує" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Некоректні дані" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Внутрішня помилка сервера" })
    public async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    @Serialize(AuthResponseDto)
    @ApiOperation({ summary: "Вхід користувача" })
    @ApiResponse({ status: HttpStatus.OK, description: "Користувач успішно увійшов" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Користувача не знайдено" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Неправильний пароль" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Некоректні дані" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Внутрішня помилка сервера" })
    public async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Patch("change-password")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Зміна пароля користувача" })
    @ApiResponse({ status: HttpStatus.OK, description: "Пароль успішно змінено" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Користувача не знайдено" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Неправильний пароль" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Некоректні дані" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Внутрішня помилка сервера" })
    @UseGuards(AccessTokenAuthGuard)
    public async changePassword(@AuthUser() user: IUserPayload, @Body() dto: ChangePasswordDto) {
        return this.authService.changePassword(user.sub, dto);
    }

    @Post("forgot-password")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Скидання пароля" })
    @ApiResponse({ status: HttpStatus.OK, description: "Повідомлення про скидання пароля надіслано" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Некоректні дані" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Користувача не знайдено" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Внутрішня помилка сервера" })
    public async forgotPassword(@Body() dto: ForgotPasswordDto) {
        return this.authService.forgotPassword(dto);
    }

    @Post("reset-password")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Відновлення пароля" })
    @ApiResponse({ status: HttpStatus.OK, description: "Пароль успішно відновлено" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Некоректні дані" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Токен або користувача не знайдено" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Токен закінчився" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Внутрішня помилка сервера" })
    public async resetPassword(@Query("token") token: string, @Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto, token);
    }

    @Post("logout")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenAuthGuard)
    @ApiResponse({ status: HttpStatus.I_AM_A_TEAPOT, description: "Користувач став чайником" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Користувач неавторизований" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Внутрішня помилка сервера" })
    public async logout(@Body() tokens: TokensDto) {
        await this.authService.logout(tokens.refreshToken, tokens.accessToken);
    }

    @Post("email-confirmation")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Підтвердження електронної пошти" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Підтвердження успішно виконано" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Токен не знайдений або користувач не знайдений" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Токен підтвердження закінчився" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Внутрішня помилка сервера" })
    public async newVerification(@Body() dto: ConfirmationDto) {
        return this.authService.newVerification(dto);
    }

    @Post("update-access-token")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Оновлення токена доступу за допомогою refresh token" })
    @ApiResponse({ status: HttpStatus.CREATED, description: "Токен доступу успішно оновлено" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Користувач неавторизований" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Внутрішня помилка сервера" })
    @UseGuards(RefreshTokenAuthGuard)
    public async updateAccessToken(@AuthUser() user: IUserPayload, @Body("refreshToken") refreshToken: string) {
        return this.authService.updateAccessToken(user, refreshToken);
    }
}
