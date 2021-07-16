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
import {
  AuthorEntity,
  AddAuthorInput,
  AddAuthorPayload,
} from './authors.entities';

import {BookConnection, BookOrder} from '~/books/books.entities';
import {GraphQLJwtGuard} from '~/auth/graphql-jwt.guard';
import {Viewer, ViewerType} from '~/auth/viewer.decorator';
import {UserEntity} from '~/users/users.entities';

@Resolver('Author')
export class AuthorsResolver {
  constructor(private authorsService: AuthorsService) {}

  @ResolveField('booksWrited')
  async authors(
    @Parent() {id}: AuthorEntity,
    @Args('skip') skip: number,
    @Args('limit') limit: number,
    @Args('orderBy') orderBy: BookOrder,
  ): Promise<BookConnection> {
    const nodes = await this.authorsService.getWritedBooks(id, {
      skip,
      limit,
      orderBy,
    });
    return {nodes};
  }

  @ResolveField('userResponsibleFor')
  async resolveUserResponsibleFor(
    @Parent() {id}: AuthorEntity,
  ): Promise<UserEntity> {
    const user = await this.authorsService.getUserResponsibleFor(id);
    if (!user) throw new InternalServerErrorException();
    return user;
  }

  @Query('author')
  async getBook(@Args('id') id: string): Promise<AuthorEntity | null> {
    return this.authorsService.getById(id);
  }

  @Mutation('addAuthor')
  @UseGuards(GraphQLJwtGuard)
  async addAuthor(
    @Viewer() {id}: ViewerType,
    @Args('input') {name}: AddAuthorInput,
  ): Promise<AddAuthorPayload> {
    const author = await this.authorsService.addAuthor({name, userId: id});

    if (!author) throw new InternalServerErrorException();

    return {author};
  }
}
