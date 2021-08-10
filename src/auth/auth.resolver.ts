import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {Args, Mutation, Resolver} from '@nestjs/graphql';

import {AuthService} from './auth.service';
import {LoginArgs, LoginPayload} from './dto/login.dto';
import {RefreshTokenArgs, RefreshTokenPayload} from './dto/refresh-token.dto';
import {SignUpArgs, SignUpPayload} from './dto/signup.dto';

@Resolver()
export class AuthResolver {
  constructor(private authServer: AuthService) {}

  @Mutation(() => LoginPayload, {name: 'login'})
  async login(@Args() {alias, password}: LoginArgs): Promise<LoginPayload> {
    const validated = await this.authServer.verifyUser({alias, password});
    if (!validated) throw new UnauthorizedException();

    const tokens = await this.authServer.generateTokens(validated);
    return {
      tokens,
    };
  }

  @Mutation(() => SignUpPayload, {name: 'signup'})
  async signup(
    @Args() {password, alias, displayName}: SignUpArgs,
  ): Promise<SignUpPayload> {
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

  @Mutation(() => RefreshTokenPayload, {name: 'refreshToken'})
  async refreshToken(
    @Args() {token}: RefreshTokenArgs,
  ): Promise<RefreshTokenPayload> {
    const tokens = await this.authServer.refreshToken(token);
    if (!tokens) throw new UnauthorizedException();
    return {tokens};
  }
}
