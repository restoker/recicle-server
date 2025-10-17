import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { CoreEntity } from "src/commons/entities/core.entity";
import { Materiales } from "src/materiales/entities/materiale.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Category extends CoreEntity {

    @IsNotEmpty()
    @IsString()
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    @MaxLength(100, { message: 'El nombre debe tener menos de 100 caracteres' })
    @Column({ unique: true })
    name: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255, { message: 'La descripción debe tener menos de 255 caracteres' })
    @MinLength(5, { message: 'La descripción debe tener al menos 5 caracteres' })
    @Column({ type: 'text' })
    description: string;

    @IsNotEmpty()
    @IsString()
    @Column()
    image: string;

    @OneToMany(() => Materiales, product => product.id)
    materiales: Materiales[]
}
