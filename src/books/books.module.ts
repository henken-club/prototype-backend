import {Module} from '@nestjs/common';

import {BooksResolver} from './books.resolver';
import {BooksService} from './books.service';

import {IdModule} from '~/id/id.module';
import {Neo4jModule} from '~/neo4j/neo4j.module';

@Module({
  imports: [Neo4jModule, IdModule],
  providers: [BooksResolver, BooksService],
  exports: [BooksService],
})
export class BooksModule {}
