import {Module} from '@nestjs/common';

import {SettingsService} from './settings.service';

import {PrismaModule} from '~/prisma/prisma.module';
import {Neo4jModule} from '~/neo4j/neo4j.module';

@Module({
  imports: [PrismaModule, Neo4jModule],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
