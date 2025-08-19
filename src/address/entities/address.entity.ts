import { IsNotEmpty, MaxLength } from "class-validator";
import { Point } from "geojson";
import { CoreEntity } from "src/commons/entities/core.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, Index, ManyToOne } from "typeorm";

@Entity()
export class Address extends CoreEntity {

    @IsNotEmpty()
    @Index({ spatial: true })
    @Column({
        type: 'point',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: false,
    })
    point: Point;

    @IsNotEmpty()
    @MaxLength(255)
    @Column({ nullable: false })
    direccion: string;

    @IsNotEmpty()
    @MaxLength(255)
    @Column({ nullable: false })
    distrito: string;

    @IsNotEmpty()
    @MaxLength(255)
    @Column({ nullable: false })
    sobrenombre: string;

    @ManyToOne(() => User, (user) => user.addresses)
    user: User;

}
