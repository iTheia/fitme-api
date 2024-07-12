import { RolesGuard } from './role-auth.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { TokenAuth } from '../token-auth/token-auth.guard';
import { Role } from './role.enum';

export function Roles(roles: Role[]) {
  return applyDecorators(UseGuards(TokenAuth, new RolesGuard(roles)));
}
