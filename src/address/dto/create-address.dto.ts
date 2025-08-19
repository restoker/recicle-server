import { PickType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumberString, IsUUID } from "class-validator";
import { Address } from "../entities/address.entity";
import { CoreOutput } from "src/commons/dtos/core-output.dto";

export class CreateAddressDtoInput extends PickType(Address, ['direccion', 'distrito', 'sobrenombre']) {

    @IsNotEmpty()
    @IsUUID()
    idUser: string;

    @IsNotEmpty()
    @IsNumberString()
    lat: number;

    @IsNotEmpty()
    @IsNumberString()
    lng: number;
}

export class CreateAddressDtoOutput extends CoreOutput {
    address?: Address;
}
