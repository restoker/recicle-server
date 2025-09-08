import { PickType } from "@nestjs/mapped-types";
import { IsLatitude, IsLatLong, IsLongitude, IsNotEmpty, IsNumber, IsNumberString, IsUUID } from "class-validator";
import { Address } from "../entities/address.entity";
import { CoreOutput } from "src/commons/dtos/core-output.dto";

export class CreateAddressDtoInput extends PickType(Address, ['direccion', 'distrito', 'sobrenombre']) {

    @IsNotEmpty()
    @IsUUID()
    userId: string;

    @IsNotEmpty()
    // @IsLatLong()
    @IsNumber()
    @IsLatitude()
    lat: number;

    @IsNotEmpty()
    // @IsLatLong()
    @IsNumber()
    @IsLongitude()
    lng: number;
}

export class CreateAddressDtoOutput extends CoreOutput {
    address?: Address;
}
