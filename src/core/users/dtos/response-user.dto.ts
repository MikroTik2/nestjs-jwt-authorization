import { Expose, Transform } from "class-transformer";

interface ValuesProps {
    obj: {
        _id: string;
    };
}

export class ResponseUserDto {
    @Expose()
    @Transform((value: ValuesProps) => value.obj._id.toString())
    _id: string;

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose()
    role: string;

    @Expose()
    is_verified: string;

    @Expose()
    method: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}
