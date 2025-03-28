import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "@/libs/db/repositories/user.repository";
import { CreateUserDto, UpdateUserDto } from "../dtos";

@Injectable()
export class UserService {
    public constructor(private readonly userRepository: UserRepository) {}

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

    public async update(id: string, dto: UpdateUserDto) {
        return this.userRepository.update(id, dto);
    }

    public async delete(id: string) {
        const user = await this.userRepository.findById(id);
        if (!user) throw new NotFoundException("User not found");

        return this.userRepository.delete(id);
    }
}
