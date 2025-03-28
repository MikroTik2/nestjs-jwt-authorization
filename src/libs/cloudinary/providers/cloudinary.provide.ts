import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CLOUDINARY } from "../constants";
import { getCloudinaryConfig } from "../configs";

export const CloudinaryProvider: Provider = {
    provide: CLOUDINARY,
    useFactory: getCloudinaryConfig,
    inject: [ConfigService],
};
