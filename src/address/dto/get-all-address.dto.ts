import { IsNotEmpty, IsNumberString, IsUUID } from "class-validator";
import { Address } from "../entities/address.entity";
import { CoreOutput } from "src/commons/dtos/core-output.dto";

export class GetAllAddressDtoInput {
    @IsNotEmpty()
    @IsUUID()
    idUser: string;
}


export class GetAllAddressDtoOutput extends CoreOutput {
    addresses?: Address[];
}