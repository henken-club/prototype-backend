import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';

import {UsersService} from '~/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async verifyUser(input: {
    alias: string;
    password: string;
  }): Promise<{uid: string} | null> {
    const result = await this.usersService.verifyPassword(input);
    if (result === null) return null;
    return {uid: result.id};
  }

  getAccessToken(user: {uid: string}): string {
    const payload = {uid: user.uid};
    return this.jwtService.sign(payload);
  }
}
