import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Column, Entity } from "typeorm";
import { CoreEntity } from "src/commons/entities/core.entity";

@Entity()
export class Verification extends CoreEntity {

    @IsString()
    @IsNotEmpty()
    @Column()
    token: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Column()
    email: string;

    @IsDate()
    @Column()
    expires: Date;
}