import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { Request } from "express";

export const AuthUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest<Request>().user;
});
