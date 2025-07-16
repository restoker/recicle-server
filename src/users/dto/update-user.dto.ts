import { PartialType, PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import { CoreOutput } from 'src/commons/dtos/core-output.dto';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserInput extends PartialType(PickType(User, ['nombre', 'telefono', 'password'] as const)) {
    @IsString()
    @IsOptional()
    @Length(5, 40)
    newPassword?: string;
}


export class UpdateUserOutput extends CoreOutput {
    @IsOptional()
    user?: User;
}