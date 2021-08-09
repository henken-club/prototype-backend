import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  BadRequestException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';

import {BookEntity, AddBookInput, AddBookPayload} from './books.entities';
import {BooksService} from './books.service';

import {AuthorConnection, AuthorOrder} from '~/authors/authors.entities';
import {GraphQLJwtGuard} from '~/auth/graphql-jwt.guard';
import {Viewer, ViewerType} from '~/auth/viewer.decorator';
import {UserEntity} from '~/users/users.entities';
import {AuthorsService} from '~/authors/authors.service';

@Resolver('Book')
export class BooksResolver {
  constructor(
    private readonly booksService: BooksService,
    private readonly authorsService: AuthorsService,
  ) {}

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
    @Args('input') {title, authors: authorIds}: AddBookInput,
  ): Promise<AddBookPayload> {
    if (
      (
        await Promise.all(
          authorIds.map((id) => this.authorsService.getById(id)),
        )
      ).includes(null)
    )
      throw new BadRequestException('not exist author');

    const book = await this.booksService.addBook(userId, {
      title,
      authors: authorIds,
    });
    if (!book) throw new InternalServerErrorException();
    return {book};
  }
}
