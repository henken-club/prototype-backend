import {Args, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InternalServerErrorException, UseGuards} from '@nestjs/common';

import {Viewer, ViewerType} from '../auth/viewer.decorator';

import {
  UserEntity,
  FollowingConnection,
  FollowerConnection,
} from './users.entities';
import {UsersService} from './users.service';

import {AnswerConnection, AnswerOrder} from '~/answers/answers.entities';
import {
  PrejudiceConnection,
  PrejudiceOrder,
} from '~/prejudices/prejudices.entities';
import {GraphQLJwtGuard} from '~/auth/graphql-jwt.guard';

@Resolver('User')
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @ResolveField('postPreduices')
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

  @ResolveField('recievedPreduices')
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

  @ResolveField('postAnswers')
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

  @Query('user')
  async getUser(@Args('alias') alias: string): Promise<UserEntity | null> {
    return this.usersService.getByAlias(alias);
  }

  @Query('viewer')
  @UseGuards(GraphQLJwtGuard)
  async getViewer(@Viewer() {id}: ViewerType): Promise<UserEntity> {
    const result = await this.usersService.getById(id);
    if (!result) throw new InternalServerErrorException();
    return result;
  }
}
