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
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';

import {Viewer, ViewerType} from '../auth/viewer.decorator';

import {
  UserEntity,
  FollowingConnection,
  FollowerConnection,
  FollowUserInput,
  FollowEntity,
  UnfollowEntity,
} from './users.entities';
import {UsersService} from './users.service';

import {AnswerConnection, AnswerOrder} from '~/answers/answers.entities';
import {
  PrejudiceConnection,
  PrejudiceOrder,
} from '~/prejudices/prejudices.entities';
import {GraphQLJwtGuard} from '~/auth/graphql-jwt.guard';
import {SettingsService} from '~/settings/settings.service';

@Resolver('User')
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private settingsService: SettingsService,
  ) {}

  @ResolveField('alias')
  async resolveAlias(@Parent() {id}: UserEntity): Promise<string> {
    const alias = await this.usersService.getAlias(id);
    if (!alias) throw new InternalServerErrorException();
    return alias;
  }

  @ResolveField('displayName')
  async resolveDisplayName(@Parent() {id}: UserEntity): Promise<string> {
    const displayName = await this.usersService.getDisplayName(id);
    if (!displayName) throw new InternalServerErrorException();
    return displayName;
  }

  @ResolveField('prejudicesPosted')
  async getPostPreduices(
    @Parent() {id}: UserEntity,
    @Args('skip') skip: number,
    @Args('limit') limit: number,
    @Args('orderBy') orderBy: PrejudiceOrder,
  ): Promise<PrejudiceConnection> {
    const nodes = await this.usersService.getPostPrejudices(id, {
      skip,
      limit,
      orderBy,
    });
    return {nodes};
  }

  @ResolveField('preduicesRecieved')
  async getRecievedPreduices(
    @Parent() {id}: UserEntity,
    @Args('skip') skip: number,
    @Args('limit') limit: number,
    @Args('orderBy') orderBy: PrejudiceOrder,
  ): Promise<PrejudiceConnection> {
    const nodes = await this.usersService.getRecivedPrejudices(id, {
      skip,
      limit,
      orderBy,
    });
    return {nodes};
  }

  @ResolveField('answersPosted')
  async getPostAnswers(
    @Parent() {id}: UserEntity,
    @Args('skip') skip: number,
    @Args('limit') limit: number,
    @Args('orderBy') orderBy: AnswerOrder,
  ): Promise<AnswerConnection> {
    const nodes = await this.usersService.getPostAnswers(id, {
      skip,
      limit,
      orderBy,
    });
    return {nodes};
  }

  @ResolveField('following')
  async getFollowing(
    @Parent() {id}: UserEntity,
    @Args('skip') skip: number,
    @Args('limit') limit: number,
  ): Promise<FollowingConnection> {
    const nodes = await this.usersService.getFollowing(id, {skip, limit});
    const totalCount = await this.usersService.getFollowingCount(id);
    if (totalCount === null) throw new InternalServerErrorException();
    return {nodes, totalCount};
  }

  @ResolveField('followers')
  async getFollowers(
    @Parent() {id}: UserEntity,
    @Args('skip') skip: number,
    @Args('limit') limit: number,
  ): Promise<FollowerConnection> {
    const nodes = await this.usersService.getFollowers(id, {skip, limit});
    const totalCount = await this.usersService.getFollowersCount(id);
    if (totalCount === null) throw new InternalServerErrorException();
    return {nodes, totalCount};
  }

  @ResolveField('canPostPrejudiceTo')
  async canPostPrejudiceTo(
    @Parent() {id: fromId}: UserEntity,
    @Args('userId') toId: string,
  ): Promise<boolean> {
    if (fromId === toId) throw new BadRequestException();
    if (!(await this.usersService.checkExists({id: toId})))
      throw new BadRequestException();

    return this.settingsService.canPostPrejudiceTo(fromId, toId);
  }

  @Query('user')
  async getUser(@Args('alias') alias: string): Promise<UserEntity | null> {
    return this.usersService.getByAlias(alias);
  }

  @Query('allUsers')
  async getAllUsers(): Promise<UserEntity[]> {
    return this.usersService.getAll();
  }

  @Query('viewer')
  @UseGuards(GraphQLJwtGuard)
  async getViewer(@Viewer() {id}: ViewerType): Promise<UserEntity> {
    const result = await this.usersService.getById(id);
    if (!result) throw new InternalServerErrorException();
    return result;
  }

  @Mutation('followUser')
  @UseGuards(GraphQLJwtGuard)
  async follow(
    @Viewer() {id: fromId}: ViewerType,
    @Args('input') {userId: toId}: FollowUserInput,
  ): Promise<FollowEntity> {
    if (await this.usersService.checkExists({id: fromId}))
      throw new BadRequestException();
    if (await this.usersService.checkExists({id: toId}))
      throw new BadRequestException();

    const result = await this.usersService.followUser(fromId, toId);
    if (!result) throw new InternalServerErrorException();

    return {
      from: {id: result.fromId},
      to: {id: result.toId},
    };
  }

  @Mutation('unfollowUser')
  @UseGuards(GraphQLJwtGuard)
  async unfollow(
    @Viewer() {id: fromId}: ViewerType,
    @Args('input') {userId: toId}: FollowUserInput,
  ): Promise<UnfollowEntity> {
    if (await this.usersService.checkExists({id: fromId}))
      throw new BadRequestException();
    if (await this.usersService.checkExists({id: toId}))
      throw new BadRequestException();

    const result = await this.usersService.unfollowUser(fromId, toId);
    if (!result) throw new InternalServerErrorException();

    return {
      from: {id: result.fromId},
      to: {id: result.toId},
    };
  }
}
