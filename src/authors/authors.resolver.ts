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

import {GraphQLJwtGuard} from '~/auth/graphql-jwt.guard';
import {Viewer, ViewerType} from '~/auth/viewer.decorator';
import {UserEntity} from '~/users/users.entities';

@Resolver(() => AuthorEntity)
export class AuthorsResolver {
  constructor(private authorsService: AuthorsService) {}

  /*
  @ResolveField('writesBooks')
  async authors(
    @Parent() {id}: AuthorEntity,
    @Args('skip') skip: number,
    @Args('limit') limit: number,
    @Args('orderBy') orderBy: BookOrder,
  ): Promise<BookConnection> {
    const nodes = await this.authorsService.getWritesBooks(id, {
      skip,
      limit,
      orderBy,
    });
    return {nodes};
  }
  */

  @ResolveField(() => UserEntity, {name: 'userResponsibleFor'})
  async resolveUserResponsibleFor(
    @Parent() {id}: AuthorEntity,
  ): Promise<UserEntity[]> {
    const user = await this.authorsService.getUserResponsibleFor(id);
    return user;
  }

  @Query(() => AuthorEntity, {name: 'author'})
  async getBook(@Args('id') id: string): Promise<AuthorEntity | null> {
    return this.authorsService.getById(id);
  }

  @Query(() => AuthorArray, {name: 'allAuthors'})
  async getAllBooks(): Promise<AuthorArray> {
    const nodes = await this.authorsService.getAll();
    return {nodes};
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
      // const count = await this.authorsService.countSearchAuthors(query);
      return {nodes};
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
