import {UnauthorizedException} from '@nestjs/common';
import {Args, Mutation, Resolver} from '@nestjs/graphql';

import {LoginPayload, LoginInput} from './auth.entities';
import {AuthService} from './auth.server';

@Resolver('Auth')
export class AuthResolver {
  constructor(private authServer: AuthService) {}

  @Mutation('login')
  async login(
    @Args('input') {alias, password}: LoginInput,
  ): Promise<LoginPayload> {
    const validated = await this.authServer.verifyUser({alias, password});
    if (!validated) throw new UnauthorizedException();

    const accessToken = this.authServer.getAccessToken(validated);
    return {accessToken};
  }
}
