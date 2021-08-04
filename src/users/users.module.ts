import {Module} from '@nestjs/common';

import {UsersResolver} from './users.resolver';
import {UsersService} from './users.service';

import {PrismaModule} from '~/prisma/prisma.module';
import {Neo4jModule} from '~/neo4j/neo4j.module';
import {SettingsModule} from '~/settings/settings.module';
import {ImgproxyModule} from '~/imgproxy/imgproxy.module';

@Module({
  imports: [PrismaModule, Neo4jModule, SettingsModule, ImgproxyModule],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
