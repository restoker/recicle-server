import { SetMetadata } from '@nestjs/common';
import { RolEnumType } from 'src/roles/entities/role.entity';

export type AllowedRoles = keyof typeof RolEnumType | "any";

export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);