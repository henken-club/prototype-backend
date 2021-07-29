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
  ForbiddenException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';

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
import {UsersService} from '~/users/users.service';
import {SettingsService} from '~/settings/settings.service';
import {GetPrejudiceInput} from '~/graphql';

@Resolver('Prejudice')
export class PrejudicesResolver {
  constructor(
    private readonly prejudicesService: PrejudicesService,
    private readonly settingsService: SettingsService,
    private readonly usersService: UsersService,
  ) {}

  @ResolveField('userFrom')
  async getUserFrom(@Parent() {id}: PrejudiceEntity): Promise<UserEntity> {
    const user = await this.prejudicesService
      .getUserFrom(id)
      .then((id) => (id ? this.usersService.getById(id) : null));
    if (!user) throw new InternalServerErrorException();
    return user;
  }

  @ResolveField('userTo')
  async getUserTo(@Parent() {id}: PrejudiceEntity): Promise<UserEntity> {
    const user = await this.prejudicesService
      .getUserTo(id)
      .then((id) => (id ? this.usersService.getById(id) : null));
    if (!user) throw new InternalServerErrorException();
    return user;
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
  async getPrejudice(
    @Args('input') {post, received, number}: GetPrejudiceInput,
  ): Promise<PrejudiceEntity | null> {
    const postUniq = this.usersService.resolveUserUniqueUnion(post);
    const receivedUniq = this.usersService.resolveUserUniqueUnion(received);

    if (!postUniq || !receivedUniq) throw new BadRequestException();
    if (
      'alias' in postUniq &&
      'alias' in receivedUniq &&
      postUniq.alias === receivedUniq.alias
    )
      throw new BadRequestException();

    const postId =
      'id' in postUniq
        ? postUniq.id
        : (await this.usersService.getByAlias(postUniq.alias))?.id;

    const receivedId =
      'id' in receivedUniq
        ? receivedUniq.id
        : (await this.usersService.getByAlias(receivedUniq.alias))?.id;

    if (!postId || !receivedId) return null;
    if (postId === receivedId) throw new BadRequestException();

    return this.prejudicesService.getByUserIdAndNumber(
      postId,
      receivedId,
      number,
    );
  }

  @Query('allPrejudices')
  async getAllPrejudices(): Promise<PrejudiceEntity[]> {
    return this.prejudicesService.getAllPrejudices();
  }

  @Mutation('postPrejudice')
  @UseGuards(GraphQLJwtGuard)
  async createPrejudice(
    @Viewer() {id: fromId}: ViewerType,
    @Args('input') {userId: toId, title, relatedBooks}: PostPrejudiceInput,
  ): Promise<PostPrejudicePayload> {
    if (fromId === toId) throw new BadRequestException();
    if (!(await this.usersService.checkExists({id: toId})))
      throw new BadRequestException();
    if (!(await this.settingsService.canPostPrejudiceTo(fromId, toId)))
      throw new ForbiddenException();

    try {
      const prejudice = await this.prejudicesService.createPrejudice(
        fromId,
        toId,
        {title, relatedBooks},
      );
      return {prejudice};
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
