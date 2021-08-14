import {
  Args,
  ID,
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

import {BookArray, BookEntity} from './books.entities';
import {BooksService} from './books.service';
import {AddBookArgs, AddBookPayload} from './dto/add-book.dto';
import {ResolveAuthorsArgs} from './dto/resolve-authors.dto';

import {AuthorArray} from '~/authors/authors.entities';
import {GraphQLJwtGuard} from '~/auth/graphql-jwt.guard';
import {Viewer, ViewerType} from '~/auth/viewer.decorator';
import {UserEntity} from '~/users/users.entities';
import {AuthorsService} from '~/authors/authors.service';

@Resolver(() => BookEntity)
export class BooksResolver {
  constructor(
    private readonly booksService: BooksService,
    private readonly authorsService: AuthorsService,
  ) {}

  @ResolveField(() => UserEntity, {name: 'userResponsibleFor'})
  async resolveUserResponsibleFor(
    @Parent() {id}: BookEntity,
  ): Promise<UserEntity[]> {
    const user = await this.booksService.getUserResponsibleFor(id);
    return user;
  }

  @ResolveField(() => AuthorArray, {name: 'authors'})
  async authors(
    @Parent() {id}: BookEntity,
    @Args() {skip, limit, orderBy}: ResolveAuthorsArgs,
  ): Promise<AuthorArray> {
    const nodes = await this.booksService.getAuthors(id, {
      skip,
      limit,
      orderBy,
    });
    const totalCount = await this.booksService.countAuthors(id);
    return {nodes, totalCount};
  }

  @Query(() => BookEntity, {name: 'getBook'})
  async getBook(
    @Args('id', {type: () => ID}) id: string,
  ): Promise<BookEntity | null> {
    return this.booksService.getById(id);
  }

  @Query(() => BookArray, {name: 'allBooks'})
  async getAllBooks(): Promise<BookArray> {
    const nodes = await this.booksService.getAll();
    const totalCount = await this.booksService.countAll();
    return {nodes, totalCount};
  }

  @Mutation(() => AddBookPayload, {name: 'addBook'})
  @UseGuards(GraphQLJwtGuard)
  async addBook(
    @Viewer() {id: userId}: ViewerType,
    @Args() {title, authors: authorIds}: AddBookArgs,
  ): Promise<AddBookPayload> {
    if (!(await this.authorsService.checkExistence(authorIds)))
      throw new BadRequestException('not exist author(s)');

    const book = await this.booksService.addBook(userId, {
      title,
      authors: authorIds,
    });
    if (!book) throw new InternalServerErrorException();
    return {book};
  }
}
