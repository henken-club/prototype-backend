import {Module} from '@nestjs/common';

import {BooksResolver} from './books.resolver';
import {BooksService} from './books.service';

@Module({
  imports: [],
  providers: [BooksResolver, BooksService],
  exports: [BooksService],
})
export class BooksModule {}
