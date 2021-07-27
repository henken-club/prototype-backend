import {Module} from '@nestjs/common';

import {PrejudicesResolver} from './prejudices.resolver';
import {PrejudicesService} from './prejudices.service';

import {IdModule} from '~/id/id.module';
import {UsersModule} from '~/users/users.module';
import {Neo4jModule} from '~/neo4j/neo4j.module';
import {SettingsModule} from '~/settings/settings.module';

@Module({
  imports: [Neo4jModule, IdModule, UsersModule, SettingsModule],
  providers: [PrejudicesResolver, PrejudicesService],
  exports: [PrejudicesService],
})
export class PrejudicesModule {}
