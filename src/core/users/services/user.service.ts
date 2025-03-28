import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "@/libs/db/repositories/user.repository";
import { CreateUserDto, UpdateUserDto } from "../dtos";
import { CloudinaryService } from "@/libs/cloudinary/services";

@Injectable()
export class UserService {
    public constructor(
        private readonly userRepository: UserRepository,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    public async create(dto: CreateUserDto) {
        return this.userRepository.create(dto);
    }

    public async findAll() {
        return this.userRepository.findAll();
    }

    public async findById(id: string) {
        return await this.userRepository.findById(id);
    }

    public async findByEmail(email: string) {
        return await this.userRepository.findByEmail(email);
    }

    public async update(id: string, dto: UpdateUserDto, avatar?: Express.Multer.File) {
        if (avatar) {
            const upload = await this.cloudinaryService.upload(avatar);
            dto.avatar = {
                public_id: upload.public_id,
                url: upload.url,
            };
        } else {
            delete dto.avatar;
        }

        return this.userRepository.update(id, dto);
    }

    public async delete(id: string) {
        const user = await this.userRepository.findById(id);
        if (!user) throw new NotFoundException("User not found");

        await this.cloudinaryService.destroy(user.avatar.public_id);
        return this.userRepository.delete(id);
    }
}
