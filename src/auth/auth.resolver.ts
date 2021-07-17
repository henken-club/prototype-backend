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
  SignupInput,
} from './auth.entities';
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

    const accessToken = await this.authServer.getAccessToken(validated);
    return {accessToken};
  }

  @Mutation('signup')
  async signup(
    @Args('input') {password, alias, displayName}: SignupInput,
  ): Promise<SignupPayload> {
    const isDuplicated = await this.authServer.checkDuplicate({alias});
    if (isDuplicated) throw new BadRequestException();

    const created = await this.authServer.signup({
      alias,
      displayName,
      password,
    });
    if (!created) throw new InternalServerErrorException();

    const accessToken = await this.authServer.getAccessToken(created);
    return {accessToken};
  }
}
