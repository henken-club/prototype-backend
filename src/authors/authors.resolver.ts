import {Args, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';

import {AuthorsService} from './authors.service';
import {AuthorEntity} from './authors.entities';

import {BookConnection, BookOrder} from '~/books/books.entities';

@Resolver('Author')
export class AuthorsResolver {
  constructor(private authorsService: AuthorsService) {}

  @ResolveField('writedBooks')
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

  @Query('author')
  async getBook(@Args('id') id: string): Promise<AuthorEntity | null> {
    return this.authorsService.getById(id);
  }
}
