import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { ENUM_TOKEN_TYPE } from "@/common/enums";

export type TokenDocument = HydratedDocument<Token>;

@Schema({ timestamps: true, versionKey: false })
export class Token {
    @Prop({ required: true })
    email: string;

    @Prop({ required: true, unique: true })
    token: string;

    @Prop({ required: true, enum: ENUM_TOKEN_TYPE })
    type: string;

    @Prop({ required: true })
    expiresIn: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
