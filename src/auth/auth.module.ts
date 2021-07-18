import {Module} from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {ConfigModule, ConfigType} from '@nestjs/config';

import {AuthService} from './auth.service';
import {AuthConfig} from './auth.config';
import {AuthResolver} from './auth.resolver';
import {JwtStrategy} from './jwt.strategy';

import {PrismaModule} from '~/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forFeature(AuthConfig),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(AuthConfig)],
      inject: [AuthConfig.KEY],
      useFactory: async (config: ConfigType<typeof AuthConfig>) => ({}),
    }),
    PrismaModule,
  ],
  providers: [AuthService, AuthResolver, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
