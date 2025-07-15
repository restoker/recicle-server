import { IsBoolean, IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, Length } from "class-validator";
import { CoreEntity } from "src/commons/entities/core.entity";
import { Column } from "typeorm";

export class User extends CoreEntity {
    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    @Column()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Column('varchar', { unique: true })
    email: string;

    @IsNotEmpty()
    @IsNumberString()
    @Length(9, 9)
    @Column({ unique: true })
    telefono: string;

    @IsOptional()
    @IsString()
    @Column({ nullable: true })
    imagen?: string;

    @IsNotEmpty()
    @Length(4, 20)
    @IsString()
    @Column()
    password: string;

    @IsBoolean()
    @IsOptional()
    @Column({ default: false })
    verified?: boolean;

    @IsBoolean()
    @IsOptional()
    @Column({ default: true })
    isActive?: boolean;

    @IsBoolean()
    @IsOptional()
    @Column({ default: false })
    two_factor_enabled?: boolean;

    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    notification_token?: string;
}
