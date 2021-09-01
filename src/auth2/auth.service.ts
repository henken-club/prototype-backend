import {Inject, Injectable} from '@nestjs/common';
import {ClientGrpc} from '@nestjs/microservices';
import {map, Observable} from 'rxjs';

import {
  CreateTemporaryUserResponse_Error_Detail,
  SigninClient,
  SIGNIN_SERVICE_NAME,
  SignupClient,
  SIGNUP_SERVICE_NAME,
} from '~/protogen/account';

@Injectable()
export class AuthService {
  private readonly signinService!: SigninClient;
  private readonly signupService!: SignupClient;

  constructor(
    @Inject('AccountClient')
    private readonly accountClient: ClientGrpc,
  ) {
    this.signinService =
      this.accountClient.getService<SigninClient>(SIGNIN_SERVICE_NAME);
    this.signupService =
      this.accountClient.getService<SignupClient>(SIGNUP_SERVICE_NAME);
  }

  createTemporaryUser(request: {
    alias: string;
    email: string;
    password: string;
    displayName: string | null;
  }): Observable<
    | {error: {duplicatedEmail: boolean; duplicatedAlias: boolean}}
    | {result: {token: string}}
  > {
    return this.signupService
      .createTemporaryUser({
        ...request,
        displayName: request.displayName || undefined,
      })
      .pipe(
        map(({result}) => {
          if (!result) throw new Error('Something broken');
          if (result.$case === 'error')
            return {
              error: {
                duplicatedEmail: result.error.details.includes(
                  CreateTemporaryUserResponse_Error_Detail.DUPLICATED_EMAIL,
                ),
                duplicatedAlias: result.error.details.includes(
                  CreateTemporaryUserResponse_Error_Detail.DUPLICATED_ALIAS,
                ),
              },
            };
          return {
            result: {token: result.registration.registerToken},
          };
        }),
      );
  }

  resendEmail(req: {token: string}): Observable<boolean> {
    return this.signupService
      .resendVerificationEmail({registerToken: req.token})
      .pipe(map(({registration}) => Boolean(registration)));
  }

  registerUser(req: {
    code: string;
    token: string;
  }): Observable<{accessToken: string; refreshToken: string}> {
    return this.signupService
      .registerUser({
        verifyCode: req.code,
        registerToken: req.token,
      })
      .pipe(
        map(({tokens}) => {
          if (!tokens) throw new Error('server error');
          return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          };
        }),
      );
  }

  signinWithAlias(request: {
    alias: string;
    password: string;
  }): Observable<{accessToken: string; refreshToken: string} | null> {
    return this.signinService
      .signin({
        name: {$case: 'alias', alias: request.alias},
        password: request.password,
      })
      .pipe(map(({tokens}) => (tokens ? tokens : null)));
  }

  signinWithEmail(request: {
    email: string;
    password: string;
  }): Observable<{accessToken: string; refreshToken: string} | null> {
    return this.signinService
      .signin({
        name: {$case: 'email', email: request.email},
        password: request.password,
      })
      .pipe(map(({tokens}) => (tokens ? tokens : null)));
  }

  refreshToken(request: {
    refreshToken: string;
  }): Observable<{accessToken: string; refreshToken: string} | null> {
    return this.signinService
      .refreshToken({refreshToken: request.refreshToken})
      .pipe(map(({tokens}) => (tokens ? tokens : null)));
  }

  verifyToken(request: {accessToken: string}): Observable<{userId: string}> {
    return this.signinService.verifyToken(request);
  }
}
