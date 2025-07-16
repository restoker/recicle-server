import { CoreOutput } from "src/commons/dtos/core-output.dto";
import { User } from "../entities/user.entity";
import { IsOptional } from "class-validator";

export class GetUsersOutput extends CoreOutput {
    @IsOptional()
    users?: User[]
}