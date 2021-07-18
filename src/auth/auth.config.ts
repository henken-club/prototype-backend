import {registerAs} from '@nestjs/config';

export const AuthConfig = registerAs('auth', () => ({
  bcryptRound: 10,

  accessJwtSecret: process.env.JWT_ACCESS_SECRET!,
  accessExpiresIn: '600s',

  refleshJwtSecret: process.env.JWT_REFLESH_SECRET!,
  refleshExpiresIn: '7d',
}));
