import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { ENUM_AUTH_METHOD, ENUM_USER_ROLES } from "@/common/enums";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, versionKey: false })
export class User {
    @Prop({ required: true, maxLength: 50 })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({
        required: function () {
            return this.method === ENUM_AUTH_METHOD.CREDENTIALS;
        },
    })
    password: string;

    @Prop({ required: true, default: false })
    is_verified: boolean;

    @Prop({ required: true, enum: ENUM_AUTH_METHOD })
    method: string;

    @Prop({ required: true, enum: ENUM_USER_ROLES, default: ENUM_USER_ROLES.USER })
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
