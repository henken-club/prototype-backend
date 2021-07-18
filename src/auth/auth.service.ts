import {Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import {AuthConfig} from './auth.config';

import {PrismaService} from '~/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AuthConfig.KEY)
    private readonly config: ConfigType<typeof AuthConfig>,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async verifyUser({
    password,
    ...where
  }: {
    alias: string;
    password: string;
  }): Promise<{uid: string} | null> {
    return this.prismaService.user
      .findUnique({
        where,
        select: {id: true, password: true},
      })
      .then(async (user) =>
        user?.password &&
        (await this.passwordService.verifyPassword(password, user.password))
          ? {uid: user.id}
          : null,
      );
  }

  async checkDuplicate({...where}: {alias: string}): Promise<boolean> {
    return this.prismaService.user
      .findUnique({where})
      .then((user) => Boolean(user));
  }

  async signup({
    password,
    ...data
  }: {
    alias: string;
    displayName: string;
    password: string;
  }): Promise<{uid: string} | null> {
    return this.prismaService.user
      .create({
        data: {
          ...data,
          password: await this.passwordService.encryptPassword(password),
        },
        select: {id: true},
      })
      .then((user) => ({uid: user.id}))
      .catch(() => null);
  }

  async generateTokens(user: {
    uid: string;
  }): Promise<{accessToken: string; refleshToken: string}> {
    return {
      accessToken: await this.generateAccessToken(user),
      refleshToken: await this.generateRefleshToken(user),
    };
  }

  async generateAccessToken(user: {uid: string}): Promise<string> {
    const payload = {uid: user.uid};
    return this.jwtService.sign(payload, {
      secret: this.config.accessJwtSecret,
      expiresIn: this.config.accessExpiresIn,
    });
  }

  async generateRefleshToken(user: {uid: string}): Promise<string> {
    const payload = {uid: user.uid};
    return this.jwtService.sign(payload, {
      secret: this.config.refleshJwtSecret,
      expiresIn: this.config.refleshExpiresIn,
    });
  }
}
