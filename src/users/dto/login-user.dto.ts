import { PickType } from "@nestjs/mapped-types";
import { User } from "../entities/user.entity";
import { CoreOutput } from "src/commons/dtos/core-output.dto";
import { IsJWT, IsOptional, IsString } from "class-validator";

export class LoginInput extends PickType(User, ['email', 'password'] as const) {

    @IsString()
    @IsOptional()
    code?: string;
}

export class LoginOutput extends CoreOutput {
    @IsOptional()
    user?: User;

    @IsOptional()
    @IsString()
    @IsJWT()
    token?: string;
}