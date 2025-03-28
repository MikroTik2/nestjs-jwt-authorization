import { UserService } from "@/core/users/services";
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly userService: UserService,
    ) {}

    async matchRoles(roles: string[], userRole: string) {
        return roles.some(role => role === userRole);
    }

    async canActivate(context: ExecutionContext) {
        const roles = this.reflector.get<string[]>("roles", context.getHandler());
        if (!roles) return true;

        const request = await context.switchToHttp().getRequest();
        const user = await this.userService.findById(request.user.sub);

        if (!user || !(await this.matchRoles(roles, user.role))) {
            throw new ForbiddenException("Вибачте, у вас недостатньо прав для доступу.");
        }

        return await this.matchRoles(roles, user.role);
    }
}
