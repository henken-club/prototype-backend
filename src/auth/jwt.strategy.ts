import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';

import {AuthConfig} from './auth.config';
import {AuthService} from './auth.service';
import {ViewerType} from './viewer.decorator';
import {JwtPayload} from './auth.entities';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AuthConfig.KEY)
    private readonly config: ConfigType<typeof AuthConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.accessJwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<ViewerType> {
    const user = await this.authService.existsUser({id: payload.uid});
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
