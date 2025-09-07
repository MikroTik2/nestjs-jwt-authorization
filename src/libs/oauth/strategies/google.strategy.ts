import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, VerifyCallback, Strategy } from "passport-google-oauth20";
import { ENUM_AUTH_METHOD } from "@/common/enums";
import { GOOGLE_STRATEGY_NAME } from "../constants";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, GOOGLE_STRATEGY_NAME) {
    public constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.get<string>("GOOGLE_CLIENT_ID"),
            clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET"),
            callbackURL: configService.get<string>("APPLICATION_URL") + "/api/v1/auth/google/callback",
            scope: ["profile", "email"],
        });
    }

    public async validate(_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) {
        const { emails, displayName, photos } = profile;

        const user = {
            name: displayName,
            email: emails[0].value,
            avatar: photos[0].value,
            method: ENUM_AUTH_METHOD.GOOGLE,
        };

        done(null, user);
    }
}
