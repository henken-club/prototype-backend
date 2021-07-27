import {Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';

import {AuthConfig} from './auth.config';
import {PasswordService} from './password.service';
import {JwtPayload} from './auth.entities';

import {PrismaService} from '~/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AuthConfig.KEY)
    private readonly config: ConfigType<typeof AuthConfig>,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async verifyUser({
    password,
    ...where
  }: {
    alias: string;
    password: string;
  }): Promise<{id: string} | null> {
    return this.prismaService.user
      .findUnique({
        where,
        select: {id: true, password: true},
      })
      .then(async (user) =>
        user?.password &&
        (await this.passwordService.verifyPassword(password, user.password))
          ? {id: user.id}
          : null,
      );
  }

  async existsUser({...where}: {id: string} | {alias: string}) {
    return this.prismaService.user.findUnique({where, select: {id: true}});
  }

  async signup({
    password,
    ...data
  }: {
    alias: string;
    displayName: string;
    password: string;
  }): Promise<{id: string} | null> {
    return this.prismaService.user
      .create({
        data: {
          ...data,
          password: await this.passwordService.encryptPassword(password),
          setting: {
            create: {},
          },
        },
        select: {id: true},
      })
      .catch(() => null);
  }

  async generateTokens(user: {
    id: string;
  }): Promise<{accessToken: string; refleshToken: string}> {
    return {
      accessToken: await this.generateAccessToken(user),
      refleshToken: await this.generateRefleshToken(user),
    };
  }

  async generateAccessToken(user: {id: string}): Promise<string> {
    const payload: JwtPayload = {uid: user.id};
    return this.jwtService.sign(payload, {
      secret: this.config.accessJwtSecret,
      expiresIn: this.config.accessExpiresIn,
    });
  }

  async generateRefleshToken(user: {id: string}): Promise<string> {
    const payload: JwtPayload = {uid: user.id};
    return this.jwtService.sign(payload, {
      secret: this.config.refleshJwtSecret,
      expiresIn: this.config.refleshExpiresIn,
    });
  }

  async refleshToken(token: string) {
    const {uid}: JwtPayload = this.jwtService.verify(token, {
      secret: this.config.refleshJwtSecret,
    });
    if (uid) return this.generateTokens({id: uid});
    return null;
  }
}
