import {Module} from '@nestjs/common';

import {BookcoverProxyModule} from '../bookcover-proxy/bookcover-proxy.module';

import {BooksResolver} from './books.resolver';
import {BooksService} from './books.service';

import {IdModule} from '~/id/id.module';
import {Neo4jModule} from '~/neo4j/neo4j.module';
import {AuthorsModule} from '~/authors/authors.module';
import {ImgproxyModule} from '~/imgproxy/imgproxy.module';

@Module({
  imports: [
    Neo4jModule,
    IdModule,
    AuthorsModule,
    ImgproxyModule,
    BookcoverProxyModule,
  ],
  providers: [BooksResolver, BooksService],
  exports: [BooksService],
})
export class BooksModule {}
