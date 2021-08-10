import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
  ID,
} from '@nestjs/graphql';
import {
  BadRequestException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';

import {
  FolloweeArray,
  FollowerArray,
  UserArray,
  UserEntity,
} from './users.entities';
import {UsersService} from './users.service';
import {FollowUserArgs, FollowUserPayload} from './dto/follow-user.dto';
import {UnfollowUserArgs, UnfollowUserPayload} from './dto/unfollow-user.dto';
import {ResolveFolloweesArgs} from './dto/resolve-followees.dto';
import {ResolvePostPrejudicesArgs} from './dto/resolve-post-prejudices.dto';
import {ResolveReceivedPrejudicesArgs} from './dto/resolve-received-prejudices.dto';
import {GetUserArgs, GetUserResult} from './dto/get-user.dto';
import {ResolvePostAnswersArgs} from './dto/resolve-post-answers.dto';

import {SettingsService} from '~/settings/settings.service';
import {ImgproxyService} from '~/imgproxy/imgproxy.service';
import {GraphQLJwtGuard} from '~/auth/graphql-jwt.guard';
import {Viewer, ViewerType} from '~/auth/viewer.decorator';
import {PrejudiceArray} from '~/prejudices/prejudices.entities';
import {AnswerArray} from '~/answers/answers.entities';
import {SettingEntity} from '~/settings/settings.entities';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private settingsService: SettingsService,
    private imgproxyService: ImgproxyService,
  ) {}

  @ResolveField(() => String, {name: 'alias'})
  async resolveAlias(@Parent() {id}: UserEntity): Promise<string> {
    const alias = await this.usersService.resolveAlias(id);
    if (!alias) throw new InternalServerErrorException();
    return alias;
  }

  @ResolveField(() => String, {name: 'displayName'})
  async resolveDisplayName(@Parent() {id}: UserEntity): Promise<string> {
    const displayName = await this.usersService.resolveDisplayName(id);
    if (!displayName) throw new InternalServerErrorException();
    return displayName;
  }

  @ResolveField(() => String, {name: 'picture'})
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

  @ResolveField(() => PrejudiceArray, {name: 'postedPrejudices'})
  async getPostPrejudices(
    @Parent() {id}: UserEntity,
    @Args() {skip, limit, orderBy}: ResolvePostPrejudicesArgs,
  ): Promise<PrejudiceArray> {
    const nodes = await this.usersService.resolvePostedPrejudices(id, {
      skip,
      limit,
      orderBy,
    });
    return {nodes};
  }

  @ResolveField(() => PrejudiceArray, {name: 'receivedPrejudices'})
  async getReceivedPrejudices(
    @Parent() {id}: UserEntity,
    @Args() {skip, limit, orderBy}: ResolveReceivedPrejudicesArgs,
  ): Promise<PrejudiceArray> {
    const nodes = await this.usersService.resolveReceivedPrejudices(id, {
      skip,
      limit,
      orderBy,
    });
    return {nodes};
  }

  @ResolveField(() => AnswerArray, {name: 'postedAnswers'})
  async getPostAnswers(
    @Parent() {id}: UserEntity,
    @Args() {skip, limit, orderBy}: ResolvePostAnswersArgs,
  ): Promise<AnswerArray> {
    const nodes = await this.usersService.resolvePostedAnswers(id, {
      skip,
      limit,
      orderBy,
    });
    return {nodes};
  }

  @ResolveField(() => FolloweeArray, {name: 'followees'})
  async getFollowing(
    @Parent() {id}: UserEntity,
    @Args() {skip, limit}: ResolveFolloweesArgs,
  ): Promise<FolloweeArray> {
    const nodes = await this.usersService.resolveFollowings(id, {
      skip,
      limit,
    });
    const totalCount = await this.usersService.countFollowings(id);
    if (totalCount === null) throw new InternalServerErrorException();
    return {nodes, totalCount};
  }

  @ResolveField(() => FollowerArray, {name: 'followers'})
  async getFollowers(
    @Parent() {id}: UserEntity,
    @Args() {skip, limit}: ResolveFolloweesArgs,
  ): Promise<FollowerArray> {
    const nodes = await this.usersService.resolveFollowers(id, {skip, limit});
    const totalCount = await this.usersService.countFollowers(id);
    if (totalCount === null) throw new InternalServerErrorException();
    return {nodes, totalCount};
  }

  @ResolveField(() => Boolean, {name: 'isFollowing'})
  async isFollowing(
    @Parent() {id: fromId}: UserEntity,
    @Args('id', {type: () => ID}) toId: string,
  ): Promise<boolean> {
    if (fromId === toId) throw new BadRequestException();
    if (!(await this.usersService.checkExists({id: toId})))
      throw new BadRequestException();

    return this.usersService.isFollowing(fromId, toId).catch(() => {
      throw new InternalServerErrorException();
    });
  }

  @ResolveField(() => Boolean, {name: 'isFollowedBy'})
  async isFollowed(
    @Parent() {id: toId}: UserEntity,
    @Args('id', {type: () => ID}) fromId: string,
  ): Promise<boolean> {
    if (fromId === toId) throw new BadRequestException();
    if (!(await this.usersService.checkExists({id: fromId})))
      throw new BadRequestException();

    return this.usersService.isFollowing(toId, toId).catch(() => {
      throw new InternalServerErrorException();
    });
  }

  @ResolveField(() => Boolean, {name: 'canPostPrejudiceTo'})
  async canPostPrejudiceTo(
    @Parent() {id: fromId}: ViewerType,
    @Args('id', {type: () => ID}) toId: string,
  ): Promise<boolean> {
    if (fromId === toId) throw new BadRequestException();
    if (!(await this.usersService.checkExists({id: toId})))
      throw new BadRequestException();

    return this.settingsService
      .getFromUserId(toId)
      .then(({policyReceivePrejudice: policy}) =>
        this.settingsService.canPostPrejudice(fromId, toId, policy),
      );
  }

  @ResolveField(() => Boolean, {name: 'canReceivePrejudiceFrom'})
  async canReceivePrejudiceFrom(
    @Parent() {id: toId}: ViewerType,
    @Args('id', {type: () => ID}) fromId: string,
  ): Promise<boolean> {
    if (fromId === toId) throw new BadRequestException();
    if (!(await this.usersService.checkExists({id: toId})))
      throw new BadRequestException();

    return this.settingsService
      .getFromUserId(toId)
      .then(({policyReceivePrejudice: policy}) =>
        this.settingsService.canPostPrejudice(fromId, toId, policy),
      );
  }

  @ResolveField(() => SettingEntity, {name: 'settings'})
  @UseGuards(GraphQLJwtGuard)
  async resolveSettings(@Parent() {id}: UserEntity): Promise<SettingEntity> {
    return this.settingsService.getFromUserId(id);
  }

  @Query(() => UserEntity, {name: 'user'})
  async getUserById(@Args('id') id: string): Promise<UserEntity | null> {
    return this.usersService.getById(id);
  }

  @Query(() => GetUserResult, {name: 'getUser'})
  async getUser(@Args() {alias}: GetUserArgs): Promise<GetUserResult> {
    return {user: await this.usersService.getByAlias(alias)};
  }

  @Query(() => UserArray, {name: 'allUsers'})
  async getAllUsers(): Promise<UserArray> {
    const nodes = await this.usersService.getAll();
    return {nodes};
  }

  @Query(() => UserEntity, {name: 'viewer'})
  @UseGuards(GraphQLJwtGuard)
  async getViewer(@Viewer() {id}: ViewerType): Promise<UserEntity> {
    const result = await this.usersService.getById(id);
    if (!result) throw new InternalServerErrorException();
    return result;
  }

  @Mutation(() => FollowUserPayload, {name: 'followUser'})
  @UseGuards(GraphQLJwtGuard)
  async follow(
    @Viewer() {id: fromId}: ViewerType,
    @Args() {id: toId}: FollowUserArgs,
  ): Promise<FollowUserPayload> {
    if (fromId === toId) throw new BadRequestException();
    if (!(await this.usersService.checkExists({id: toId})))
      throw new BadRequestException();

    return this.usersService.followUser(fromId, toId).catch(() => {
      throw new InternalServerErrorException();
    });
  }

  @Mutation(() => UnfollowUserPayload, {name: 'unfollowUser'})
  @UseGuards(GraphQLJwtGuard)
  async unfollow(
    @Viewer() {id: from}: ViewerType,
    @Args() {id: toId}: UnfollowUserArgs,
  ): Promise<UnfollowUserPayload> {
    if (from === toId) throw new BadRequestException();
    if (!(await this.usersService.checkExists({id: toId})))
      throw new BadRequestException();

    return this.usersService.unfollowUser(from, toId).catch(() => {
      throw new InternalServerErrorException();
    });
  }
}
