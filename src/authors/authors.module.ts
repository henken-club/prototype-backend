import {Module} from '@nestjs/common';

import {AuthorsResolver} from './authors.resolver';
import {AuthorsService} from './authors.service';

import {IdModule} from '~/id/id.module';
import {Neo4jModule} from '~/neo4j/neo4j.module';

@Module({
  imports: [Neo4jModule, IdModule],
  providers: [AuthorsResolver, AuthorsService],
  exports: [AuthorsService],
})
export class AuthorsModule {}
