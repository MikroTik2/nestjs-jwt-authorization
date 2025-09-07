import { BadRequestException, Injectable } from "@nestjs/common";
import { Readable } from "stream";
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

@Injectable()
export class CloudinaryService {
    public async upload(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
        try {
            if (typeof file === "string") {
                return await cloudinary.uploader.upload(file);
            } else {
                return await new Promise((resolve, reject) => {
                    const upload = cloudinary.uploader.upload_stream((error, result) => {
                        if (error) return reject(error);
                        if (!result) return reject(new Error("Upload result is undefined"));
                        resolve(result);
                    });
                    Readable.from(file.buffer).pipe(upload);
                });
            }
        } catch (error) {
            throw new BadRequestException(`Не вдалося завантажити файл з хмарного сховища: ${error.message}`);
        }
    }

    public async update(file: Express.Multer.File, public_id: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
        try {
            if (typeof file === "string") {
                return await cloudinary.uploader.upload(file, { public_id, overwrite: true, resource_type: "image" });
            } else {
                return await new Promise((resolve, reject) => {
                    const upload = cloudinary.uploader.upload_stream({ public_id, overwrite: true, resource_type: "image" }, (error, result) => {
                        if (error) return reject(error);
                        if (!result) return reject(new Error("Upload result is undefined"));
                        resolve(result);
                    });
                    Readable.from(file.buffer).pipe(upload);
                });
            }
        } catch (error) {
            throw new BadRequestException(`Не вдалося оновити файл з хмарного сховища: ${error.message}`);
        }
    }

    public async destroy(public_id: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
        try {
            return await cloudinary.uploader.destroy(public_id);
        } catch (error) {
            throw new BadRequestException(`Не вдалося знищити файл з хмарного сховища: ${error.message}`);
        }
    }
}
