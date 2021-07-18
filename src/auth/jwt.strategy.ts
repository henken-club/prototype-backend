import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';

import {AuthConfig} from './auth.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(AuthConfig.KEY) config: ConfigType<typeof AuthConfig>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.accessJwtSecret,
    });
  }

  async validate(payload: {uid: string}) {
    return {id: payload.uid};
  }
}
