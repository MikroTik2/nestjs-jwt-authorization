import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../models";
import { CreateUserDto, UpdateUserDto } from "@/core/users/dtos";

@Injectable()
export class UserRepository {
    public constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    public async create(dto: CreateUserDto): Promise<UserDocument> {
        return this.userModel.create(dto);
    }

    public async findAll(): Promise<UserDocument[]> {
        return this.userModel.find().exec();
    }

    public async findById(id: string): Promise<UserDocument> {
        return this.userModel.findById(id).exec();
    }

    public async findByEmail(email: string): Promise<UserDocument> {
        return this.userModel.findOne({ email }).exec();
    }

    public async update(id: string, dto: UpdateUserDto): Promise<UserDocument> {
        return this.userModel.findByIdAndUpdate(id, dto, { new: true });
    }

    public async delete(id: string): Promise<void> {
        await this.userModel.findByIdAndDelete(id);
    }
}
