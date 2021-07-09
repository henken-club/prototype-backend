import {Module} from '@nestjs/common';

import {BooksResolver} from './books.resolver';
import {BooksService} from './books.service';

import {IdModule} from '~/id/id.module';

@Module({
  imports: [IdModule],
  providers: [BooksResolver, BooksService],
  exports: [BooksService],
})
export class BooksModule {}
