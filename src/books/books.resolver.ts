import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {UseGuards} from '@nestjs/common';

import {BookEntity, AddBookInput} from './books.entities';
import {BooksService} from './books.service';

import {AuthorConnection, AuthorOrder} from '~/authors/authors.entities';
import {GraphQLJwtGuard} from '~/auth/graphql-jwt.guard';
import {Viewer, ViewerType} from '~/auth/viewer.decorator';

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
  @UseGuards(GraphQLJwtGuard)
  async addBook(
    @Viewer() {id}: ViewerType,
    @Args('input') {title}: AddBookInput,
  ): Promise<BookEntity | null> {
    return this.booksService.addBook({title});
  }
}
