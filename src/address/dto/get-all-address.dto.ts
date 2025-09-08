import { IsNotEmpty, IsNumberString, IsUUID } from "class-validator";
import { Address } from "../entities/address.entity";
import { CoreOutput } from "src/commons/dtos/core-output.dto";

export class GetAllAddressDtoInput {
    @IsNotEmpty()
    @IsUUID()
    idUser: string;
}

interface AddressResponse extends Pick<Address, 'id' | 'direccion' | 'distrito' | 'sobrenombre'> {
    lat: number;
    lng: number;
}

export class GetAllAddressDtoOutput extends CoreOutput {
    addresses?: AddressResponse[];
}