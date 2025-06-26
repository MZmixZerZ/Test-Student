import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { SCOPES_KEY } from '../decorators/scopes.decorator';

@Injectable()
export class RolesAndScopesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const requiredScopes = this.reflector.getAllAndOverride<string[]>(
      SCOPES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }
    // console.log('requiredRoles', requiredRoles);
    // console.log(user.role);
    // ตรวจสอบบทบาท (Roles)
    if (
      requiredRoles &&
      !requiredRoles.some((role) => user.role?.includes(role))
    ) {
      throw new ForbiddenException('User does not have the required roles');
    }

    // ตรวจสอบสิทธิ์การเข้าถึง (Scopes)
    if (
      requiredScopes &&
      !requiredScopes.every((scope) => user.scopes?.includes(scope))
    ) {
      throw new ForbiddenException('User does not have the required scopes');
    }

    return true;
  }
}
