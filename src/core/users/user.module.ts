import { Module } from "@nestjs/common";
import { DbModule } from "@/libs/db";
import { CloudinaryModule } from "@/libs/cloudinary";
import { UserService } from "./services";
import { UserController } from "./controllers";

@Module({
    imports: [DbModule, CloudinaryModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
