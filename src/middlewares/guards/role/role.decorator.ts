import { RolesGuard } from './role-auth.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { TokenAuth } from '../token-auth/token-auth.guard';

export function Roles(roles: string[]) {
  return applyDecorators(UseGuards(TokenAuth, new RolesGuard(roles)));
}
