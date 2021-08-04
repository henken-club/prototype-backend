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
  GetUserResult,
  GetUserInput,
} from './users.entities';
import {UsersService} from './users.service';

import {AnswerConnection, AnswerOrder} from '~/answers/answers.entities';
import {
  PrejudiceConnection,
  PrejudiceOrder,
} from '~/prejudices/prejudices.entities';
import {GraphQLJwtGuard} from '~/auth/graphql-jwt.guard';
import {SettingsService} from '~/settings/settings.service';
import {ImgproxyService} from '~/imgproxy/imgproxy.service';

@Resolver('User')
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private settingsService: SettingsService,
    private imgproxyService: ImgproxyService,
  ) {}

  @ResolveField('alias')
  async resolveAlias(@Parent() {id}: UserEntity): Promise<string> {
    const alias = await this.usersService.resolveAlias(id);
    if (!alias) throw new InternalServerErrorException();
    return alias;
  }

  @ResolveField('displayName')
  async resolveDisplayName(@Parent() {id}: UserEntity): Promise<string> {
    const displayName = await this.usersService.resolveDisplayName(id);
    if (!displayName) throw new InternalServerErrorException();
    return displayName;
  }

  @ResolveField('picture')
  async resolvePicture(@Parent() {id}: UserEntity): Promise<string> {
    return this.usersService
      .resolvePicture(id)
      .then((picture) =>
        this.imgproxyService.proxy(picture, {extension: 'webp'}),
      )
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });
  }

  @ResolveField('postedPrejudices')
  async getPostPrejudices(
    @Parent() {id}: UserEntity,
    @Args('skip') skip: number,
    @Args('limit') limit: number,
    @Args('orderBy') orderBy: PrejudiceOrder,
  ): Promise<PrejudiceConnection> {
    const nodes = await this.usersService.resolvePostedPrejudices(id, {
      skip,
      limit,
      orderBy,
    });
    return {nodes};
  }

  @ResolveField('receivedPrejudices')
  async getReceivedPrejudices(
    @Parent() {id}: UserEntity,
    @Args('skip') skip: number,
    @Args('limit') limit: number,
    @Args('orderBy') orderBy: PrejudiceOrder,
  ): Promise<PrejudiceConnection> {
    const nodes = await this.usersService.resolveReceivedPrejudices(id, {
      skip,
      limit,
      orderBy,
    });
    return {nodes};
  }

  @ResolveField('postedAnswers')
  async getPostAnswers(
    @Parent() {id}: UserEntity,
    @Args('skip') skip: number,
    @Args('limit') limit: number,
    @Args('orderBy') orderBy: AnswerOrder,
  ): Promise<AnswerConnection> {
    const nodes = await this.usersService.resolvePostedAnswers(id, {
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
    const nodes = await this.usersService.resolveFollowings(id, {
      skip,
      limit,
    });
    const totalCount = await this.usersService.countFollowings(id);
    if (totalCount === null) throw new InternalServerErrorException();
    return {nodes, totalCount};
  }

  @ResolveField('followers')
  async getFollowers(
    @Parent() {id}: UserEntity,
    @Args('skip') skip: number,
    @Args('limit') limit: number,
  ): Promise<FollowerConnection> {
    const nodes = await this.usersService.resolveFollowers(id, {skip, limit});
    const totalCount = await this.usersService.countFollowers(id);
    if (totalCount === null) throw new InternalServerErrorException();
    return {nodes, totalCount};
  }

  @ResolveField('canPostPrejudiceTo')
  @UseGuards(GraphQLJwtGuard)
  async canPostPrejudiceTo(
    @Viewer() {id: fromId}: ViewerType,
    @Parent() {id: toId}: UserEntity,
  ): Promise<boolean> {
    if (fromId === toId) throw new BadRequestException();
    if (!(await this.usersService.checkExists({id: toId})))
      throw new BadRequestException();

    return this.settingsService.canPostPrejudiceTo(fromId, toId);
  }

  @Query('user')
  async getUserById(@Args('id') id: string): Promise<UserEntity | null> {
    return this.usersService.getById(id);
  }

  @Query('getUser')
  async getUser(@Args('input') input: GetUserInput): Promise<GetUserResult> {
    return this.usersService
      .convertUserUniqueUnion(input)
      .then((id) => (id ? {user: {id}} : {user: null}));
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
    @Args('input') {user}: FollowUserInput,
  ): Promise<FollowEntity> {
    const toId = await this.usersService.convertUserUniqueUnion(user);
    if (!toId || fromId === toId) throw new BadRequestException();

    return this.usersService
      .followUser(fromId, toId)
      .then((res) => res)
      .catch(() => {
        throw new InternalServerErrorException();
      });
  }

  @Mutation('unfollowUser')
  @UseGuards(GraphQLJwtGuard)
  async unfollow(
    @Viewer() {id: from}: ViewerType,
    @Args('input') {user}: FollowUserInput,
  ): Promise<UnfollowEntity> {
    const toId = await this.usersService.convertUserUniqueUnion(user);
    if (!toId || from === toId) throw new BadRequestException();

    return this.usersService
      .unfollowUser(from, toId)
      .then((res) => res)
      .catch(() => {
        throw new InternalServerErrorException();
      });
  }
}
