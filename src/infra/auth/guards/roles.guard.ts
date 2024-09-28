import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getClass(),
    ]);

    if (!requiredRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user.role === requiredRole;
  }
}
