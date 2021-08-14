import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {InternalServerErrorException, UseGuards} from '@nestjs/common';

import {AuthorsService} from './authors.service';
import {AuthorArray, AuthorEntity} from './authors.entities';
import {AddAuthorArgs, AddAuthorPayload} from './dto/add-author.dto';
import {SearchAuthorsArgs} from './dto/search-authors.dto';
import {ResolveWritesBooksArgs} from './dto/resolve-writes-books.dto';
import {GetAuthorArgs, GetAuthorPayload} from './dto/get-author.dto';

import {GraphQLJwtGuard} from '~/auth/graphql-jwt.guard';
import {Viewer, ViewerType} from '~/auth/viewer.decorator';
import {UserEntity} from '~/users/users.entities';
import {BookArray} from '~/books/books.entities';

@Resolver(() => AuthorEntity)
export class AuthorsResolver {
  constructor(private authorsService: AuthorsService) {}

  @ResolveField(() => BookArray, {name: 'writesBooks'})
  async resolveWritesBooks(
    @Parent() {id}: AuthorEntity,
    @Args() {skip, limit, orderBy}: ResolveWritesBooksArgs,
  ): Promise<BookArray> {
    const nodes = await this.authorsService.getWritesBooks(id, {
      skip,
      limit,
      orderBy,
    });
    const totalCount = await this.authorsService.countWritesBooks(id);
    return {nodes, totalCount};
  }

  @ResolveField(() => UserEntity, {name: 'userResponsibleFor'})
  async resolveUserResponsibleFor(
    @Parent() {id}: AuthorEntity,
  ): Promise<UserEntity[]> {
    const user = await this.authorsService.getUserResponsibleFor(id);
    return user;
  }

  @Query(() => GetAuthorPayload, {name: 'getAuthor'})
  async getAuthor(@Args() {id}: GetAuthorArgs): Promise<GetAuthorPayload> {
    const author = await this.authorsService.getById(id);
    return {author};
  }

  @Query(() => AuthorArray, {name: 'allAuthors'})
  async getAllAuthors(): Promise<AuthorArray> {
    const nodes = await this.authorsService.getAll();
    const totalCount = await this.authorsService.countAll();
    return {nodes, totalCount};
  }

  @Query(() => AuthorArray, {name: 'searchAuthors'})
  async searchAuthors(
    @Args() {query, skip, limit}: SearchAuthorsArgs,
  ): Promise<AuthorArray> {
    try {
      const nodes = await this.authorsService.searchAuthors(query, {
        skip,
        limit,
      });
      const totalCount = await this.authorsService.countSearchAuthors(query);
      return {nodes, totalCount};
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Mutation(() => AddAuthorPayload, {name: 'addAuthor'})
  @UseGuards(GraphQLJwtGuard)
  async addAuthor(
    @Viewer() {id: userId}: ViewerType,
    @Args() {name}: AddAuthorArgs,
  ): Promise<AddAuthorPayload> {
    const author = await this.authorsService.addAuthor(userId, {name});
    if (!author) throw new InternalServerErrorException();
    return {author};
  }
}
