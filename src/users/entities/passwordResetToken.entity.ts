import { IsDate, IsEmail, IsString, IsUUID } from "class-validator";
import { CoreEntity } from "src/commons/entities/core.entity";
import { Column, Entity } from "typeorm";


@Entity()
export class PasswordResetToken extends CoreEntity {

    @IsString()
    @IsUUID()
    @Column()
    token: string;

    @IsString()
    @IsEmail()
    @Column()
    email: string;

    @IsDate()
    @Column()
    expires: Date;
}

