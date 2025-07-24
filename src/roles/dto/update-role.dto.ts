import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleInput } from './create-role.dto';
import { CoreOutput } from 'src/commons/dtos/core-output.dto';

export class UpdateRoleDto extends PartialType(CreateRoleInput) { }

export class UpdateRoleOutput extends CoreOutput { }
