import {registerAs} from '@nestjs/config';

export const AuthConfig = registerAs('auth', () => ({
  bcryptRound: 10,

  accessJwtSecret: process.env.JWT_ACCESS_SECRET!,
  accessExpiresIn: '600s',

  refreshJwtSecret: process.env.JWT_REFRESH_SECRET!,
  refreshExpiresIn: '7d',
}));
