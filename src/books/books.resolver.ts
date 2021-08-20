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
import {Observable, of} from 'rxjs';

import {BookArray, BookEntity} from './books.entities';
import {BooksService} from './books.service';
import {AddBookArgs, AddBookPayload} from './dto/add-book.dto';
import {ResolveAuthorsArgs} from './dto/resolve-authors.dto';
import {FindBookArgs, FindBookPayload} from './dto/find-book.dto';

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

  @ResolveField(() => String, {name: 'cover', nullable: true})
  resolveBookcover(@Parent() {isbn}: BookEntity): Observable<string | null> {
    if (!isbn) return of(null);
    return this.booksService.getBookcoverFromISBN(isbn);
  }

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

  @Query(() => BookEntity, {name: 'book'})
  async getBookById(
    @Args('id', {type: () => ID}) id: string,
  ): Promise<BookEntity> {
    const book = await this.booksService.getById(id);
    if (!book) throw new BadRequestException();
    return book;
  }

  @Query(() => FindBookPayload, {name: 'findBook'})
  async findBook(@Args() {id}: FindBookArgs): Promise<FindBookPayload> {
    const book = await this.booksService.getById(id);
    return {book};
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
    @Args() {title, authors, isbn}: AddBookArgs,
  ): Promise<AddBookPayload> {
    if (!(await this.authorsService.checkExistence(authors)))
      throw new BadRequestException('not exist author(s)');

    const book = await this.booksService.addBook(userId, {
      title,
      authors,
      isbn: isbn || null,
    });
    if (!book) throw new InternalServerErrorException();
    return {book};
  }
}
