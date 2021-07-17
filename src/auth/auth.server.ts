import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import {PrismaService} from '~/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
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
        user?.password && (await bcrypt.compare(password, user.password))
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
        data: {...data, password: await bcrypt.hash(password, 10)},
        select: {id: true},
      })
      .then((user) => ({uid: user.id}))
      .catch(() => null);
  }

  async getAccessToken(user: {uid: string}): Promise<string> {
    const payload = {uid: user.uid};
    return this.jwtService.sign(payload);
  }
}
