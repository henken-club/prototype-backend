import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {Args, Mutation, Resolver} from '@nestjs/graphql';

import {
  LoginPayload,
  LoginInput,
  SignupPayload,
  RefleshTokenInput,
  RefleshTokenPayload,
  SignupInput,
} from './auth.entities';
import {AuthService} from './auth.service';

@Resolver('Auth')
export class AuthResolver {
  constructor(private authServer: AuthService) {}

  @Mutation('login')
  async login(
    @Args('input') {alias, password}: LoginInput,
  ): Promise<LoginPayload> {
    const validated = await this.authServer.verifyUser({alias, password});
    if (!validated) throw new UnauthorizedException();

    const tokens = await this.authServer.generateTokens(validated);
    return {
      tokens,
    };
  }

  @Mutation('signup')
  async signup(
    @Args('input') {password, alias, displayName}: SignupInput,
  ): Promise<SignupPayload> {
    const isDuplicated = await this.authServer
      .existsUser({alias})
      .then((user) => Boolean(user));
    if (isDuplicated) throw new BadRequestException();

    const created = await this.authServer.signup({
      alias,
      displayName,
      password,
    });
    if (!created) throw new InternalServerErrorException();

    const tokens = await this.authServer.generateTokens(created);
    return {
      tokens,
    };
  }

  @Mutation('refleshToken')
  async refleshToken(
    @Args('input') {token}: RefleshTokenInput,
  ): Promise<RefleshTokenPayload> {
    const tokens = await this.authServer.refleshToken(token);
    if (!tokens) throw new UnauthorizedException();
    return {tokens};
  }
}
