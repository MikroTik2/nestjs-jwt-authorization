import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-github";
import { ENUM_AUTH_METHOD } from "@/common/enums";
import { GITHUB_STRATEGY_NAME } from "../constants";
import { firstValueFrom, map } from "rxjs";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, GITHUB_STRATEGY_NAME) {
    public constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
        super({
            clientID: configService.get<string>("GITHUB_CLIENT_ID"),
            clientSecret: configService.get<string>("GITHUB_CLIENT_SECRET"),
            callbackURL: configService.get<string>("APPLICATION_URL") + "/api/v1/auth/github/callback",
            scope: ["user:email"],
        });
    }

    async validate(accessToken: string, _refreshToken: string, profile: Profile, done) {
        const { username } = profile;

        const emails = await firstValueFrom(
            this.httpService
                .get("https://api.github.com/user/emails", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .pipe(map(response => response.data)),
        );

        const user = {
            name: username,
            email: emails[0].email,
            method: ENUM_AUTH_METHOD.GITHUB,
        };

        done(null, user);
    }
}
