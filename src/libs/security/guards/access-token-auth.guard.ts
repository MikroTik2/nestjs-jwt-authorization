import { Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ACCESS_STRATEGY_NAME } from "../constants";

@Injectable()
export class AccessTokenAuthGuard extends AuthGuard(ACCESS_STRATEGY_NAME) {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(err, user) {
        if (err || !user) {
            throw err ?? new UnauthorizedException();
        }
        return user;
    }
}
