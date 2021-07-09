import {Args, Query, Resolver} from '@nestjs/graphql';

import {BookEntity} from './books.entities';
import {BooksService} from './books.service';

@Resolver('Book')
export class BooksResolver {
  constructor(private booksService: BooksService) {}

  @Query()
  async book(@Args('id') id: string): Promise<BookEntity | null> {
    return this.booksService.getById(id);
  }
}
