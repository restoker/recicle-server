import { IsEnum, IsNotEmpty, NotEquals } from "class-validator";
import { CoreOutput } from "src/commons/dtos/core-output.dto";
import { RolEnumType } from "src/roles/entities/role.entity";

export class UpdateRolInput {
    @IsEnum(RolEnumType)
    @IsNotEmpty()
    @NotEquals(RolEnumType[RolEnumType.client])
    rol: RolEnumType
}

export class UpdateRolOutput extends CoreOutput { }