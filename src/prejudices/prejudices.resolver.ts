import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {UseGuards} from '@nestjs/common';

import {
  PrejudiceEntity,
  PostPrejudiceInput,
  PostPrejudicePayload,
} from './prejudices.entities';
import {PrejudicesService} from './prejudices.service';

import {UserEntity} from '~/users/users.entities';
import {AnswerEntity} from '~/answers/answers.entities';
import {BookConnection, BookOrder} from '~/books/books.entities';
import {Viewer, ViewerType} from '~/auth/viewer.decorator';
import {GraphQLJwtGuard} from '~/auth/graphql-jwt.guard';

@Resolver('Prejudice')
export class PrejudicesResolver {
  constructor(private prejudicesService: PrejudicesService) {}

  @ResolveField('userFrom')
  async getUserFrom(@Parent() {id}: PrejudiceEntity): Promise<UserEntity> {
    return this.prejudicesService.getUserFrom(id);
  }

  @ResolveField('userTo')
  async getUserTo(@Parent() {id}: PrejudiceEntity): Promise<UserEntity> {
    return this.prejudicesService.getUserTo(id);
  }

  @ResolveField('answeredBy')
  async getAnswer(
    @Parent() {id}: PrejudiceEntity,
  ): Promise<AnswerEntity | null> {
    return this.prejudicesService.getAnswer(id);
  }

  @ResolveField('relatedBooks')
  async getrelatedBooks(
    @Parent() {id}: PrejudiceEntity,
    @Args('skip') skip: number,
    @Args('limit') limit: number,
    @Args('orderBy') orderBy: BookOrder,
  ): Promise<BookConnection> {
    const nodes = await this.prejudicesService.getRelatedBooks(id, {
      skip,
      limit,
      orderBy,
    });
    return {nodes};
  }

  @Query('prejudice')
  async getPrejudice(@Args('id') id: string): Promise<PrejudiceEntity | null> {
    return this.prejudicesService.getById(id);
  }

  @Mutation('postPrejudice')
  @UseGuards(GraphQLJwtGuard)
  async createPrejudice(
    @Viewer() {id: from}: ViewerType,
    @Args('input') {userId: to, title, relatedBooks}: PostPrejudiceInput,
  ): Promise<PostPrejudicePayload> {
    const prejudice = await this.prejudicesService.createPrejudice({
      from,
      to,
      title,
      relatedBooks,
    });
    return {prejudice};
  }
}
