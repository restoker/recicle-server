import { PickType } from "@nestjs/mapped-types";
import { User } from "../entities/user.entity";
import { CoreOutput } from "src/commons/dtos/core-output.dto";

export class CreateUserInput extends PickType(User, ['email', 'password', 'nombre', 'telefono', 'imagen', 'notification_token'] as const) { }


export class CreateUserOutput extends CoreOutput { }