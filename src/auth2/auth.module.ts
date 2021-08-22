import {Module} from '@nestjs/common';
import {ConfigModule, ConfigType} from '@nestjs/config';
import {ClientsModule, Transport} from '@nestjs/microservices';

import {AuthResolver} from './auth.resolver';
import {AuthService} from './auth.service';
import {AuthGuard} from './auth.guard';

import {AccountConfig} from '~/services/account.config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AccountClient',
        imports: [ConfigModule.forFeature(AccountConfig)],
        inject: [AccountConfig.KEY],
        useFactory: async (config: ConfigType<typeof AccountConfig>) => ({
          transport: Transport.GRPC,
          options: config.options,
        }),
      },
    ]),
  ],
  providers: [AuthGuard, AuthResolver, AuthService],
})
export class AuthModule {}
