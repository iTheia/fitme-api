import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from './role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly requiredRol: string[]) {}

  canActivate(context: ExecutionContext) {
    const { user } = context.switchToHttp().getRequest();

    const rolesOfUser = user.roles;

    if (rolesOfUser.includes(Role.Admin)) {
      return true;
    }

    if (this.requiredRol.some((role) => rolesOfUser.includes(role))) {
      return true;
    }
    return false;
  }
}
