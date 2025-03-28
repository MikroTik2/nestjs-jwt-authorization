import { Module } from "@nestjs/common";
import { DbModule } from "@/libs/db";
import { UserService } from "./services";
import { UserController } from "./controllers";

@Module({
    imports: [DbModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
