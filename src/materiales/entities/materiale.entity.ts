import { IsNumber, IsString, IsUrl, IsUUID } from "class-validator";
import { Category } from "src/categories/entities/category.entity";
import { CoreEntity } from "src/commons/entities/core.entity";
import { Column, Entity, ManyToOne } from "typeorm";


@Entity()
export class Materiales extends CoreEntity {
    @IsString()
    // @Column({ unique: true })
    @Column()
    name: string;

    @IsString()
    @IsUrl()
    @Column()
    image: string;

    @IsNumber()
    @Column()
    price: number;

    @IsString()
    @Column()
    description: string;

    @Column()
    @IsUUID()
    id_category: number;

    @ManyToOne(() => Category, (category) => category.id)
    category: Category
}
