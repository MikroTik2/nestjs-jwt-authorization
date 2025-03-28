import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { GithubStrategy, GoogleStrategy } from "./strategies";

@Module({
    imports: [HttpModule],
    providers: [GoogleStrategy, GithubStrategy],
})
export class OAuthModule {}
