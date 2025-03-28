import { NestInterceptor, Injectable, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class FileToBodyInterceptor implements NestInterceptor {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const req = ctx.getRequest();
        if (req.body && req.file?.fieldname) {
            const { fieldname } = req.file;
            if (!req.body[fieldname]) {
                req.body[fieldname] = req.file;
            }
        }

        return next.handle();
    }
}
