import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import {BookEntity, AddBookInput} from './books.entities';
import {BooksService} from './books.service';

import {AuthorConnection, AuthorOrder} from '~/authors/authors.entities';

@Resolver('Book')
export class BooksResolver {
  constructor(private booksService: BooksService) {}

  @ResolveField('authors')
  async authors(
    @Parent() {id}: BookEntity,
    @Args('skip') skip: number,
    @Args('limit') limit: number,
    @Args('orderBy') orderBy: AuthorOrder,
  ): Promise<AuthorConnection> {
    const nodes = await this.booksService.getAuthors(id, {
      skip,
      limit,
      orderBy,
    });
    return {nodes};
  }

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
