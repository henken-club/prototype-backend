import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import {GqlExecutionContext} from '@nestjs/graphql';
import {map} from 'rxjs';

import {AuthService} from './auth.service';

export function RequireAuth() {
  return applyDecorators(UseGuards(AuthGuard));
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    const req = gqlContext.getContext().req;
    const token = '?';

    if (!token) return false;

    return this.auth.verifyToken({accessToken: token}).pipe(map(() => {}));
  }
}
