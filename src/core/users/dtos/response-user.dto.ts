import { Expose, Transform } from "class-transformer";

interface IValuesProps {
    obj: {
        _id: string;
        avatar: { public_id: string; url: string };
    };
}

export class ResponseUserDto {
    @Expose()
    @Transform((value: IValuesProps) => value.obj._id.toString())
    _id: string;

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose()
    role: string;

    @Expose()
    is_verified: boolean;

    @Expose()
    method: string;

    @Expose()
    @Transform(({ obj }) =>
        obj.avatar
            ? {
                  public_id: obj.avatar.public_id,
                  url: obj.avatar.url,
              }
            : null,
    )
    avatar: { public_id: string; url: string } | null;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}
