import { Column, Entity } from "typeorm";
import { IsDate, IsEmail, IsString, IsUUID } from "class-validator";
import { CoreEntity } from "src/commons/entities/core.entity";

@Entity()
export class TwoFactorToken extends CoreEntity {

    @IsString()
    @IsUUID()
    @Column()
    code: string;

    @IsUUID()
    @Column()
    userId: string;

    @IsString()
    @IsEmail()
    @Column()
    email: string;

    @IsDate()
    @Column()
    expires: Date;
}
