import { SetMetadata } from '@nestjs/common';
import { RoleUtilisateur } from '../../common/enums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleUtilisateur[]) => SetMetadata(ROLES_KEY, roles);
