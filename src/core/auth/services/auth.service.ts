import { UserService } from "@/core/users/services";
import { PasswordService, TokenService } from "@/libs/security/services";
import { RedisService } from "@/libs/redis/services";
import { TokenRepository } from "@/libs/db/repositories/token.repository";
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";

import { RegisterDto, LoginDto, ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto, ConfirmationDto } from "../dtos";
import { ENUM_AUTH_METHOD, ENUM_USER_ROLES, ENUM_TOKEN_TYPE } from "@/common/enums";
import { MailService } from "@/libs/mail/services";
import { nanoid } from "nanoid";
import { IUserPayload } from "@/common/interfaces";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    public constructor(
        private readonly userService: UserService,
        private readonly redisService: RedisService,
        private readonly tokenService: TokenService,
        private readonly passwordService: PasswordService,
        private readonly configService: ConfigService,
        private readonly mailService: MailService,
        private readonly tokenRepository: TokenRepository,
    ) {}

    public async register(dto: RegisterDto) {
        if (await this.userService.findByEmail(dto.email.toLowerCase())) {
            throw new BadRequestException("Реєстрація не вдалася. Користувач із таким email уже існує. Будь ласка, використовуйте інший email або увійдіть у систему.");
        }

        const hashedPassword = await this.passwordService.scryptHash(dto.password);
        const user = await this.userService.create({
            ...dto,
            email: dto.email.toLowerCase(),
            password: hashedPassword,
            role: ENUM_USER_ROLES.USER,
            method: ENUM_AUTH_METHOD.CREDENTIALS,
            is_verified: false,
        });

        const payload = { sub: user._id, email: user.email };
        const tokens = await this.generateTokens(payload);

        const verificationToken = await this.generateVerificationToken(dto.email);

        await this.mailService.sendConfirmationEmail(verificationToken.email, verificationToken.token);

        return { user, ...tokens };
    }
    IRequest;

    public async login(dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email.toLowerCase());
        if (!user) throw new BadRequestException("Користувача не знайдено. Будь ласка, перевірте введені дані");

        const isPasswordValid = await this.passwordService.scryptVerify(dto.password, user.password);
        if (!isPasswordValid) throw new BadRequestException("Неправильний пароль. Будь ласка, спробуйте ще раз або відновіть пароль, якщо забули його.");

        if (!user.is_verified) {
            const verificationToken = await this.generateVerificationToken(dto.email);

            await this.mailService.sendConfirmationEmail(verificationToken.email, verificationToken.token);

            throw new UnauthorizedException("Ваш email не підтверджено. Будь ласка, перевірте вашу пошту і підтвердіть адресу.");
        }

        const payload = { sub: user._id, email: user.email };
        const tokens = await this.generateTokens(payload);

        return { user, ...tokens };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async validateOAuthLogin(req: any) {
        const { name, email, method } = req.user;
        let user = await this.userService.findByEmail(req.user.email);

        if (!user) {
            user = await this.userService.create({
                name,
                email,
                method,
                role: ENUM_USER_ROLES.USER,
                is_verified: true,
                password: "",
            });
        }

        const payload = { sub: user._id, email: user.email };
        const tokens = await this.generateTokens(payload);

        return { user, ...tokens };
    }

    public async changePassword(userId: string, dto: ChangePasswordDto) {
        const user = await this.userService.findById(userId);
        if (!user) throw new BadRequestException("Користувача не знайдено. Будь ласка, перевірте введені дані");

        const isPasswordValid = await this.passwordService.scryptVerify(dto.oldPassword, user.password);
        if (!isPasswordValid) throw new BadRequestException("Неправильний пароль. Будь ласка, спробуйте ще раз або відновіть пароль, якщо забули його.");

        const hashedPassword = await this.passwordService.scryptHash(dto.newPassword);
        await this.userService.update(userId, { password: hashedPassword });
    }

    public async forgotPassword(dto: ForgotPasswordDto) {
        const existingUser = await this.userService.findByEmail(dto.email);

        if (!existingUser) {
            throw new NotFoundException("Користувача не знайдено. Будь ласка, перевірте введену адресу електронної пошти та спробуйте знову.");
        }

        const passwordResetToken = await this.generatePasswordResetToken(existingUser.email);

        await this.mailService.sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

        return { message: "Інструкції щодо скидання пароля надіслано на вашу електронну пошту." };
    }

    public async resetPassword(dto: ResetPasswordDto, token: string) {
        const existingToken = await this.tokenRepository.findByToken(token, ENUM_TOKEN_TYPE.PASSWORD_RESET);

        if (!existingToken) {
            throw new NotFoundException("Токен не знайдено. Будь ласка, перевірте правильність введеного токена або запросіть новий.");
        }

        const hasExpired = new Date(existingToken.expiresIn) < new Date();

        if (hasExpired) {
            throw new BadRequestException("Токен закінчився. Будь ласка, запросіть новий токен для підтвердження скидання пароля.");
        }

        const existingUser = await this.userService.findByEmail(existingToken.email);

        if (!existingUser) {
            throw new NotFoundException("Користувача не знайдено. Будь ласка, перевірте введену адресу електронної пошти та спробуйте знову.");
        }

        await this.userService.update(existingUser.id, {
            password: await this.passwordService.scryptHash(dto.password),
        });

        await this.tokenRepository.deleteById(existingToken.id);
    }

    public async logout(refreshToken: string, accessToken: string) {
        await this.redisService.setTokenToBlacklist(accessToken, this.configService.get<number>("ACCESS_EXPIRE_TIME") / 1000);
        await this.redisService.setTokenToBlacklist(refreshToken, this.configService.get<number>("REFRESH_EXPIRE_TIME") / 1000);
    }

    public async newVerification(dto: ConfirmationDto) {
        const existingToken = await this.tokenRepository.findByToken(dto.token, ENUM_TOKEN_TYPE.VERIFICATION);

        if (!existingToken) {
            throw new NotFoundException("Токен підтвердження не знайдено. Будь ласка, переконайтеся, що у вас правильний токен.");
        }

        const hasExpired = new Date(existingToken.expiresIn) < new Date();

        if (hasExpired) {
            throw new BadRequestException("Токен підтвердження закінчився. Будь ласка, запросіть новий токен для підтвердження.");
        }

        const exisingUser = await this.userService.findByEmail(existingToken.email);

        if (!exisingUser) {
            throw new NotFoundException("Користувача не знайдено. Будь ласка, перевірте введену адресу електронної пошти та спробуйте знову.");
        }

        await this.userService.update(exisingUser.id, {
            is_verified: true,
        });

        await this.tokenRepository.deleteById(existingToken.id);
    }

    public async updateAccessToken(user: IUserPayload, refreshToken: string) {
        if (!refreshToken) {
            throw new BadRequestException("Токен оновлення відсутній");
        }

        const payload = { sub: user.sub, email: user.email };
        const accessToken = await this.tokenService.createAccessToken(payload);

        return { accessToken };
    }

    private async generateTokens<T>(payload: { sub: T; email?: string }) {
        const accessToken = await this.tokenService.createAccessToken(payload);
        const refreshToken = await this.tokenService.createRefreshToken(payload);

        return { accessToken, refreshToken };
    }

    private async generatePasswordResetToken(email: string) {
        const token = nanoid(65);
        const expiresIn = new Date(new Date().getTime() + 3600 * 1000);

        const existingToken = await this.tokenRepository.findByEmail(email, ENUM_TOKEN_TYPE.PASSWORD_RESET);

        if (existingToken) {
            await this.tokenRepository.deleteById(existingToken.id);
        }

        return await this.tokenRepository.create(email, token, expiresIn, ENUM_TOKEN_TYPE.PASSWORD_RESET);
    }

    private async generateVerificationToken(email: string) {
        const token = nanoid(65);
        const expiresIn = new Date(new Date().getTime() + 3600 * 1000);

        const existingToken = await this.tokenRepository.findByEmail(email, ENUM_TOKEN_TYPE.VERIFICATION);

        if (existingToken) {
            await this.tokenRepository.deleteById(existingToken.id);
        }

        return await this.tokenRepository.create(email, token, expiresIn, ENUM_TOKEN_TYPE.VERIFICATION);
    }
}
