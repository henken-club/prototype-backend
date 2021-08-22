import {Module} from '@nestjs/common';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {ConfigModule, ConfigType} from '@nestjs/config';

import {UsersResolver} from './users.resolver';
import {UsersService} from './users.service';

import {PrismaModule} from '~/prisma/prisma.module';
import {Neo4jModule} from '~/neo4j/neo4j.module';
import {SettingsModule} from '~/settings/settings.module';
import {AvatarConfig} from '~/services/avatar.config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AvatarClient',
        imports: [ConfigModule.forFeature(AvatarConfig)],
        inject: [AvatarConfig.KEY],
        useFactory: async (config: ConfigType<typeof AvatarConfig>) => ({
          transport: Transport.GRPC,
          options: config.options,
        }),
      },
    ]),
    PrismaModule,
    Neo4jModule,
    SettingsModule,
  ],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
