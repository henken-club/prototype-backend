import {
  Args,
  ID,
  Int,
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

import {PrejudiceArray, PrejudiceEntity} from './prejudices.entities';
import {PrejudicesService} from './prejudices.service';
import {GetPrejudiceArgs, GetPrejudicePayload} from './dto/get-prejudice';
import {
  PostPrejudiceArgs,
  PostPrejudicePayload,
} from './dto/post-prejudice.dto';

import {UserEntity} from '~/users/users.entities';
import {UsersService} from '~/users/users.service';
import {SettingsService} from '~/settings/settings.service';
import {GraphQLJwtGuard} from '~/auth/graphql-jwt.guard';
import {Viewer, ViewerType} from '~/auth/viewer.decorator';
import {AnswerEntity} from '~/answers/answers.entities';

@Resolver(() => PrejudiceEntity)
export class PrejudicesResolver {
  constructor(
    private readonly prejudicesService: PrejudicesService,
    private readonly settingsService: SettingsService,
    private readonly usersService: UsersService,
  ) {}

  @ResolveField(() => String, {name: 'title'})
  async resolveTitle(@Parent() {id}: PrejudiceEntity): Promise<string> {
    return this.prejudicesService.resolveTitle(id).catch(() => {
      throw new InternalServerErrorException();
    });
  }

  @ResolveField(() => Date, {name: 'createdAt'})
  async resolveCreatedAt(@Parent() {id}: PrejudiceEntity): Promise<Date> {
    return this.prejudicesService.resolveCreatedAt(id).catch(() => {
      throw new InternalServerErrorException();
    });
  }

  @ResolveField(() => Int, {name: 'number'})
  async resolveNumber(@Parent() {id}: PrejudiceEntity): Promise<Date> {
    return this.prejudicesService.resolveNumber(id).catch(() => {
      throw new InternalServerErrorException();
    });
  }

  @ResolveField(() => UserEntity, {name: 'posted'})
  async getUserFrom(@Parent() {id}: PrejudiceEntity): Promise<UserEntity> {
    const user = await this.prejudicesService
      .resolveUserPosted(id)
      .then((id) => (id ? this.usersService.getById(id) : null));
    if (!user) throw new InternalServerErrorException();
    return user;
  }

  @ResolveField(() => UserEntity, {name: 'received'})
  async getUserTo(@Parent() {id}: PrejudiceEntity): Promise<UserEntity> {
    const user = await this.prejudicesService
      .resolveUserReceived(id)
      .then((id) => (id ? this.usersService.getById(id) : null));
    if (!user) throw new InternalServerErrorException();
    return user;
  }

  @ResolveField(() => AnswerEntity, {name: 'answer', nullable: true})
  async getAnswer(
    @Parent() {id}: PrejudiceEntity,
  ): Promise<AnswerEntity | null> {
    return this.prejudicesService.resolveAnswer(id);
  }

  /*
  @ResolveField('relatedBooks')
  async getRelatedBooks(
    @Parent() {id}: PrejudiceEntity,
    @Args('skip') skip: number,
    @Args('limit') limit: number,
    @Args('orderBy') orderBy: BookOrder,
  ): Promise<BookConnection> {
    const nodes = await this.prejudicesService.resolveRelatedBooks(id, {
      skip,
      limit,
      orderBy,
    });
    return {nodes};
  }
  */

  @Query(() => PrejudiceEntity, {name: 'prejudice'})
  async getPrejudiceById(
    @Args('id', {type: () => ID}) id: string,
  ): Promise<PrejudiceEntity | null> {
    return this.prejudicesService.getById(id);
  }

  @Query(() => GetPrejudicePayload, {name: 'getPrejudice'})
  async getPrejudice(
    @Args() {posted, received, number}: GetPrejudiceArgs,
  ): Promise<GetPrejudicePayload> {
    if (posted === received) throw new BadRequestException();
    if (!(await this.usersService.checkExists({id: posted})))
      throw new BadRequestException();
    if (!(await this.usersService.checkExists({id: received})))
      throw new BadRequestException();

    return {
      prejudice: await this.prejudicesService.getByUserIdAndNumber(
        posted,
        received,
        number,
      ),
    };
  }

  @Query(() => PrejudiceArray, {name: 'allPrejudices'})
  async getAllPrejudices(): Promise<PrejudiceArray> {
    const nodes = await this.prejudicesService.getAllPrejudices();
    return {nodes};
  }

  @Mutation(() => PostPrejudicePayload, {name: 'postPrejudice'})
  @UseGuards(GraphQLJwtGuard)
  async postPrejudice(
    @Viewer() {id: postId}: ViewerType,
    @Args()
    {userId: receivedId, title, relatedBooks}: PostPrejudiceArgs,
  ): Promise<PostPrejudicePayload> {
    if (postId === receivedId) throw new BadRequestException();
    if (!(await this.usersService.checkExists({id: receivedId})))
      throw new BadRequestException();

    if (
      !(await this.settingsService
        .getFromUserId(postId)
        .then(({policyReceivePrejudice: policy}) =>
          this.settingsService.canPostPrejudice(postId, receivedId, policy),
        ))
    )
      throw new ForbiddenException();

    return this.prejudicesService
      .createPrejudice(postId, receivedId, {title, relatedBooks})
      .then((prejudice) => ({prejudice}))
      .catch(() => {
        throw new InternalServerErrorException();
      });
  }
}
