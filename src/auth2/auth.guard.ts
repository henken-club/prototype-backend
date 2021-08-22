import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import {GqlExecutionContext} from '@nestjs/graphql';

import {AuthService} from './auth.service';

export function RequireAuth() {
  return applyDecorators(UseGuards(AuthGuard));
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const req = gqlContext.getContext().req;

    // this.authService.verifyToken({req.});console.dir(req);

    return true;
  }
}
