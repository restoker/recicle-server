import { PickType } from "@nestjs/mapped-types";
import { Rol } from "../entities/role.entity";
import { CoreOutput } from "src/commons/dtos/core-output.dto";

export class CreateRoleInput extends PickType(Rol, ['name', 'image', 'route']) { }

export class CreateRoleOutput extends CoreOutput { }
