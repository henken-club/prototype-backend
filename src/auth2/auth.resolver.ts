import {Args, Mutation, Resolver} from '@nestjs/graphql';
import {Observable} from 'rxjs';

import {SigninArgs, SigninPayload} from './dto/signin.dto';
import {RefreshTokenArgs, RefreshTokenPayload} from './dto/refresh-token.dto';
import {SignUpArgs, SignUpPayload} from './dto/signup.dto';
import {AuthService} from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignUpPayload, {name: 'signup'})
  signUp(
    @Args() args: SignUpArgs,
  ): Observable<{accessToken: string; refreshToken: string}> {
    return this.authService.signup(args);
  }

  @Mutation(() => SigninPayload, {name: 'signin'})
  signin(
    @Args() {username, password}: SigninArgs,
  ): Observable<{accessToken: string; refreshToken: string}> {
    return username.includes('@')
      ? this.authService.signinWithEmail({email: username, password})
      : this.authService.signinWithAlias({alias: username, password});
  }

  @Mutation(() => RefreshTokenPayload, {name: 'refreshToken'})
  refreshToken(
    @Args() {refreshToken}: RefreshTokenArgs,
  ): Observable<{accessToken: string}> {
    return this.authService.refreshToken({refreshToken});
  }
}
