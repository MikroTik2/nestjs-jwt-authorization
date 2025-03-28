import { Module } from "@nestjs/common";
import { CloudinaryService } from "./services";
import { CloudinaryProvider } from "./providers";

@Module({
    providers: [CloudinaryService, CloudinaryProvider],
    exports: [CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {}
