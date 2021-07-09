import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';

import {BookEntity} from './books.entities';
import {BooksService} from './books.service';

import {AddBookInput} from '~/graphql';

@Resolver('Book')
export class BooksResolver {
  constructor(private booksService: BooksService) {}

  @Query('book')
  async getBook(@Args('id') id: string): Promise<BookEntity | null> {
    return this.booksService.getById(id);
  }

  @Mutation('addBook')
  async addBook(
    @Args('input') {title}: AddBookInput,
  ): Promise<BookEntity | null> {
    return this.booksService.addBook({title});
  }
}
