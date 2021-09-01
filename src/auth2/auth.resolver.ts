import {Args, Mutation, Resolver} from '@nestjs/graphql';
import {map, Observable} from 'rxjs';
import {BadRequestException, UnauthorizedException} from '@nestjs/common';

import {SigninArgs, SigninPayload} from './dto/signin.dto';
import {RefreshTokenArgs, RefreshTokenPayload} from './dto/refresh-token.dto';
import {AuthService} from './auth.service';
import {
  CreateTempUserArgs,
  CreateTempUserPayload,
} from './dto/create-temp-user.dto';
import {RegisterUserArgs, RegisterUserPayload} from './dto/register-user.dto';
import {
  ResendVerificationEmailArgs,
  ResendVerificationEmailPayload,
} from './dto/resend-verification-email.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => CreateTempUserPayload, {name: 'createTempUser'})
  createTempUser(
    @Args() args: CreateTempUserArgs,
  ): Observable<{token: string}> {
    return this.authService.createTemporaryUser(args).pipe(
      map((result) => {
        if ('error' in result) throw new BadRequestException();
        return {token: result.result.token};
      }),
    );
  }

  @Mutation(() => ResendVerificationEmailPayload, {
    name: 'resendVerificationEmail',
  })
  resendVerificationEmail(
    @Args() args: ResendVerificationEmailArgs,
  ): Observable<{success: boolean}> {
    return this.authService
      .resendEmail(args)
      .pipe(map((success) => ({success})));
  }

  @Mutation(() => RegisterUserPayload, {name: 'registerUser'})
  registerUser(
    @Args() args: RegisterUserArgs,
  ): Observable<{accessToken: string; refreshToken: string}> {
    return this.authService.registerUser(args);
  }

  @Mutation(() => SigninPayload, {name: 'signin'})
  signin(
    @Args() {username, password}: SigninArgs,
  ): Observable<{accessToken: string; refreshToken: string}> {
    return (
      username.includes('@')
        ? this.authService.signinWithEmail({email: username, password})
        : this.authService.signinWithAlias({alias: username, password})
    ).pipe(
      map((tokens) => {
        if (!tokens) throw new UnauthorizedException();
        return tokens;
      }),
    );
  }

  @Mutation(() => RefreshTokenPayload, {name: 'refreshToken'})
  refreshToken(
    @Args() {refreshToken}: RefreshTokenArgs,
  ): Observable<{accessToken: string; refreshToken: string}> {
    return this.authService.refreshToken({refreshToken}).pipe(
      map((tokens) => {
        if (!tokens) throw new UnauthorizedException();
        return tokens;
      }),
    );
  }
}
