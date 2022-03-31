import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './gql-role.param';
import { Role } from 'src/apis/user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const gqlContext =
      GqlExecutionContext.create(context).getContext().req.user;

    return (
      gqlContext && gqlContext.role && requiredRoles.includes(gqlContext.role)
    );
  }
}
