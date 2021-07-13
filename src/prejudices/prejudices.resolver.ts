import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {UseGuards} from '@nestjs/common';

import {PrejudiceEntity, CreatePrejudiceInput} from './prejudices.entities';
import {PrejudicesService} from './prejudices.service';

import {UserEntity} from '~/users/users.entities';
import {AnswerEntity} from '~/answers/answers.entities';
import {BookConnection, BookOrder} from '~/books/books.entities';
import {Viewer, ViewerType} from '~/auth/viewer.decorator';
import {GraphQLJwtGuard} from '~/auth/graphql-jwt.guard';

@Resolver('Prejudice')
export class PrejudicesResolver {
  constructor(private prejudicesService: PrejudicesService) {}

  @ResolveField('from')
  async getUserFrom(@Parent() {id}: PrejudiceEntity): Promise<UserEntity> {
    return this.prejudicesService.getUserFrom(id);
  }

  @ResolveField('to')
  async getUserTo(@Parent() {id}: PrejudiceEntity): Promise<UserEntity> {
    return this.prejudicesService.getUserTo(id);
  }

  @ResolveField('answer')
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

  @Mutation('createPrejudice')
  @UseGuards(GraphQLJwtGuard)
  async createPrejudice(
    @Viewer() {id: from}: ViewerType,
    @Args('input') input: CreatePrejudiceInput,
  ): Promise<PrejudiceEntity> {
    return this.prejudicesService.createPrejudice({from, ...input});
  }
}
