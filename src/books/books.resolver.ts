import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {InternalServerErrorException, UseGuards} from '@nestjs/common';

import {BookEntity, AddBookInput, AddBookPayload} from './books.entities';
import {BooksService} from './books.service';

import {AuthorConnection, AuthorOrder} from '~/authors/authors.entities';
import {GraphQLJwtGuard} from '~/auth/graphql-jwt.guard';
import {Viewer, ViewerType} from '~/auth/viewer.decorator';
import {UserEntity} from '~/users/users.entities';

@Resolver('Book')
export class BooksResolver {
  constructor(private booksService: BooksService) {}

  @ResolveField('userResponsibleFor')
  async resolveUserResponsibleFor(
    @Parent() {id}: BookEntity,
  ): Promise<UserEntity[]> {
    const user = await this.booksService.getUserResponsibleFor(id);
    return user;
  }

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

  @Query('allBooks')
  async getAllBooks(): Promise<BookEntity[]> {
    return this.booksService.getAll();
  }

  @Mutation('addBook')
  @UseGuards(GraphQLJwtGuard)
  async addBook(
    @Viewer() {id: userId}: ViewerType,
    @Args('input') {title, authors}: AddBookInput,
  ): Promise<AddBookPayload> {
    const book = await this.booksService.addBook(userId, {title, authors});
    if (!book) throw new InternalServerErrorException();
    return {book};
  }
}
