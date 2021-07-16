import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';

import {Neo4jService} from './neo4j.service';

import {Neo4jConfig} from '~/neo4j/neo4j.config';

@Module({
  imports: [ConfigModule.forFeature(Neo4jConfig)],
  providers: [Neo4jService],
  exports: [Neo4jService],
})
export class Neo4jModule {}
