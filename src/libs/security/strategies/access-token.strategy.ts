import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UserRepository } from "@/libs/db/repositories";
import { ACCESS_STRATEGY_NAME } from "@/libs/security/constants";
import { RedisService } from "@/libs/redis/services";
import { IUserPayload } from "@/common/interfaces";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, ACCESS_STRATEGY_NAME) {
    public constructor(
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
        private readonly userRepository: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("ACCESS_SECRET"),
            algorithms: ["HS256"],
            passReqToCallback: true,
        } as StrategyOptionsWithRequest);
    }

    public async validate(req: Request, payload: IUserPayload) {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        const isTokenInBlacklist = await this.redisService.get(token);

        if (isTokenInBlacklist) {
            throw new UnauthorizedException("Токен вже в чорному списку");
        }

        const user = await this.userRepository.findById(payload.sub);

        if (!user) {
            throw new UnauthorizedException("Будь ласка, увійдіть, щоб продовжити");
        }

        return {
            sub: user.id,
            email: user.email,
        };
    }
}
