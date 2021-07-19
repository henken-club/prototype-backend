import * as bcrypt from 'bcrypt';
import {Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';

import {AuthConfig} from './auth.config';

@Injectable()
export class PasswordService {
  constructor(
    @Inject(AuthConfig.KEY)
    private readonly config: ConfigType<typeof AuthConfig>,
  ) {}

  async encryptPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.config.bcryptRound);
  }

  async verifyPassword(input: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(input, encrypted);
  }
}
