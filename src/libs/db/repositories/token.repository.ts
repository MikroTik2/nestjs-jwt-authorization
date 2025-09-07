import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Token, TokenDocument } from "@/libs/db/models";
import { ENUM_TOKEN_TYPE } from "@/common/enums";

@Injectable()
export class TokenRepository {
    public constructor(@InjectModel(Token.name) private tokenModel: Model<TokenDocument>) {}

    public async create(email: string, token: string, expiresIn: Date, type: ENUM_TOKEN_TYPE): Promise<TokenDocument> {
        return await this.tokenModel.create({
            token,
            email,
            expiresIn,
            type,
        });
    }

    public async findByEmail(email: string, type: ENUM_TOKEN_TYPE): Promise<TokenDocument> {
        return await this.tokenModel.findOne({
            email,
            type,
        });
    }

    public async findByToken(token: string, type: ENUM_TOKEN_TYPE): Promise<TokenDocument> {
        return await this.tokenModel.findOne({
            token,
            type,
        });
    }

    public async deleteById(id: string): Promise<void> {
        await this.tokenModel.findByIdAndDelete(id);
    }
}
