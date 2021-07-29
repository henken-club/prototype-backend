import {Injectable} from '@nestjs/common';
import {int} from 'neo4j-driver';

import {UserEntity, UserUniqueUnion} from './users.entities';
import {
  CYPHER_FOLLOW_USER,
  CYPHER_GET_USER_FOLLOWERS,
  CYPHER_GET_USER_FOLLOWERS_COUNT,
  CYPHER_GET_USER_FOLLOWING,
  CYPHER_GET_USER_FOLLOWING_COUNT,
  CYPHER_GET_USER_POST_ANSWERS_ORDERBY_CREATED_AT_ASC,
  CYPHER_GET_USER_POST_ANSWERS_ORDERBY_CREATED_AT_DESC,
  CYPHER_GET_USER_POST_PREJUDICES_ORDERBY_CREATED_AT_ASC,
  CYPHER_GET_USER_POST_PREJUDICES_ORDERBY_CREATED_AT_DESC,
  CYPHER_GET_USER_RECIVED_PREJUDICES_ORDERBY_CREATED_AT_ASC,
  CYPHER_GET_USER_RECIVED_PREJUDICES_ORDERBY_CREATED_AT_DESC,
  CYPHER_UNFOLLOW_USER,
} from './users.cypher';

import {Neo4jService} from '~/neo4j/neo4j.service';
import {
  PrejudiceEntity,
  PrejudiceOrder,
} from '~/prejudices/prejudices.entities';
import {OrderDirection} from '~/common/common.entities';
import {AnswerOrder} from '~/graphql';
import {AnswerEntity} from '~/answers/answers.entities';
import {PrismaService} from '~/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly prismaService: PrismaService,
  ) {}

  resolveUserUniqueUnion(
    input: UserUniqueUnion,
  ): {id: string} | {alias: string} | null {
    if (input.id) return {id: input.id};
    if (input.alias) return {alias: input.alias};
    return null;
  }

  async checkExists(where: {id: string}): Promise<boolean> {
    return this.prismaService.user
      .findUnique({where})
      .then((user) => Boolean(user));
  }

  async getById(id: string): Promise<UserEntity | null> {
    return this.prismaService.user.findUnique({
      where: {id},
      select: {id: true},
    });
  }

  async getByAlias(alias: string): Promise<UserEntity | null> {
    return this.prismaService.user.findUnique({
      where: {alias},
      select: {id: true},
    });
  }

  async getAll(): Promise<UserEntity[]> {
    return this.prismaService.user.findMany({select: {id: true}});
  }

  async getAlias(id: string) {
    return this.prismaService.user
      .findUnique({where: {id}, select: {alias: true}})
      .then((user) => user?.alias || null);
  }

  async getDisplayName(id: string) {
    return this.prismaService.user
      .findUnique({where: {id}, select: {displayName: true}})
      .then((user) => user?.displayName || null);
  }

  async getPicture(id: string): Promise<string> {
    return this.prismaService.user
      .findUnique({
        where: {id},
        select: {alias: true},
        rejectOnNotFound: true,
      })
      .then(
        ({alias}) =>
          `https://identicon-api.herokuapp.com/${alias}/256?format=png`,
      );
  }

  getPostPrejudicesQuery({direction, field}: PrejudiceOrder) {
    if (direction === OrderDirection.ASC)
      return CYPHER_GET_USER_POST_PREJUDICES_ORDERBY_CREATED_AT_ASC;
    else return CYPHER_GET_USER_POST_PREJUDICES_ORDERBY_CREATED_AT_DESC;
  }

  async getPostPrejudices(
    id: string,
    {
      skip,
      limit,
      orderBy,
    }: {skip: number; limit: number; orderBy: PrejudiceOrder},
  ): Promise<PrejudiceEntity[]> {
    const query = this.getPostPrejudicesQuery(orderBy);
    return this.neo4jService
      .read(query, {id, skip: int(skip), limit: int(limit)})
      .then((result) =>
        result.records.map((record) => ({
          id: record.get('id'),
          title: record.get('title'),
          createdAt: new Date(record.get('createdAt')),
        })),
      );
  }

  getRecivedPrejudicesQuery({direction, field}: PrejudiceOrder) {
    if (direction === OrderDirection.ASC)
      return CYPHER_GET_USER_RECIVED_PREJUDICES_ORDERBY_CREATED_AT_ASC;
    else return CYPHER_GET_USER_RECIVED_PREJUDICES_ORDERBY_CREATED_AT_DESC;
  }

  async getRecivedPrejudices(
    id: string,
    {
      skip,
      limit,
      orderBy,
    }: {skip: number; limit: number; orderBy: PrejudiceOrder},
  ): Promise<PrejudiceEntity[]> {
    const query = this.getRecivedPrejudicesQuery(orderBy);
    return this.neo4jService
      .read(query, {id, skip: int(skip), limit: int(limit)})
      .then((result) =>
        result.records.map((record) => ({
          id: record.get('id'),
          title: record.get('title'),
          createdAt: new Date(record.get('createdAt')),
        })),
      );
  }

  getPostAnswersQuery({direction, field}: AnswerOrder) {
    if (direction === OrderDirection.ASC)
      return CYPHER_GET_USER_POST_ANSWERS_ORDERBY_CREATED_AT_ASC;
    else return CYPHER_GET_USER_POST_ANSWERS_ORDERBY_CREATED_AT_DESC;
  }

  async getPostAnswers(
    id: string,
    {skip, limit, orderBy}: {skip: number; limit: number; orderBy: AnswerOrder},
  ): Promise<AnswerEntity[]> {
    const query = this.getPostAnswersQuery(orderBy);
    return this.neo4jService
      .read(query, {id, skip: int(skip), limit: int(limit)})
      .then((result) =>
        result.records.map((record) => ({
          id: record.get('id'),
          createdAt: new Date(record.get('createdAt')),
          correctness: record.get('correctness'),
          text: record.get('text'),
        })),
      );
  }

  async getFollowing(
    id: string,
    {skip, limit}: {skip: number; limit: number},
  ): Promise<{id: string; alias: string; displayName: string}[]> {
    return this.neo4jService
      .read(CYPHER_GET_USER_FOLLOWING, {id, skip: int(skip), limit: int(limit)})
      .then((result) =>
        result.records.map((record) => ({
          id: record.get('id'),
          alias: record.get('alias'),
          displayName: record.get('displayName'),
        })),
      );
  }

  async getFollowingCount(id: string): Promise<number | null> {
    return this.neo4jService
      .read(CYPHER_GET_USER_FOLLOWING_COUNT, {id})
      .then((result) =>
        result.records.length === 1
          ? result.records[0].get('count').toNumber()
          : null,
      );
  }

  async getFollowers(
    id: string,
    {skip, limit}: {skip: number; limit: number},
  ): Promise<{id: string; alias: string; displayName: string}[]> {
    return this.neo4jService
      .read(CYPHER_GET_USER_FOLLOWERS, {id, skip: int(skip), limit: int(limit)})
      .then((result) =>
        result.records.map((record) => ({
          id: record.get('id'),
          alias: record.get('alias'),
          displayName: record.get('displayName'),
        })),
      );
  }

  async getFollowersCount(id: string): Promise<number | null> {
    return this.neo4jService
      .read(CYPHER_GET_USER_FOLLOWERS_COUNT, {id})
      .then((result) =>
        result.records.length === 1
          ? result.records[0].get('count').toNumber()
          : null,
      );
  }

  async followUser(
    from: string,
    to: string,
  ): Promise<{fromId: string; toId: string} | null> {
    const result = await this.neo4jService.write(CYPHER_FOLLOW_USER, {
      from,
      to,
    });
    if (result.records.length !== 1) return null;
    return {
      fromId: result.records[0].get('fromId'),
      toId: result.records[0].get('toId'),
    };
  }

  async unfollowUser(
    from: string,
    to: string,
  ): Promise<{fromId: string; toId: string} | null> {
    const result = await this.neo4jService.write(CYPHER_UNFOLLOW_USER, {
      from,
      to,
    });
    if (result.records.length !== 1) return null;
    return {
      fromId: result.records[0].get('fromId'),
      toId: result.records[0].get('toId'),
    };
  }
}
