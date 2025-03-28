import type { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import type { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";

export type ClassConstructor = new (...args: unknown[]) => object;

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: ClassConstructor) {}
    intercept(context: ExecutionContext, handler: CallHandler): Observable<unknown> {
        return handler.handle().pipe(
            map((data: ClassConstructor) => {
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true,
                    exposeUnsetFields: false,
                });
            }),
        );
    }
}
