import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {ClientGrpc} from '@nestjs/microservices';
import {Observable} from 'rxjs';

import {AuthClient, AUTH_SERVICE_NAME} from '~/protogen/account';

@Injectable()
export class AuthService implements OnModuleInit {
  private authService!: AuthClient;

  constructor(
    @Inject('AccountClient')
    private readonly accountClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService =
      this.accountClient.getService<AuthClient>(AUTH_SERVICE_NAME);
  }

  signup({
    displayName,
    ...rest
  }: {
    email: string;
    alias: string;
    password: string;
    displayName: string | null;
  }): Observable<{accessToken: string; refreshToken: string}> {
    return this.authService.signUp({
      ...(displayName ? {displayName} : {}),
      ...rest,
    });
  }

  signinWithAlias(request: {
    alias: string;
    password: string;
  }): Observable<{accessToken: string; refreshToken: string}> {
    return this.authService.signinWithAlias(request);
  }

  signinWithEmail(request: {
    email: string;
    password: string;
  }): Observable<{accessToken: string; refreshToken: string}> {
    return this.authService.signinWithEmail(request);
  }

  refreshToken(request: {
    refreshToken: string;
  }): Observable<{accessToken: string}> {
    return this.authService.refreshToken(request);
  }

  verifyToken(request: {accessToken: string}): Observable<{userId: string}> {
    return this.authService.verifyToken(request);
  }
}
