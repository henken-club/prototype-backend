import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import {UserEntity} from './users.entities';
import {UsersService} from './users.service';

import {AnswerEntity} from '~/answers/answers.entities';
import {PrejudiceEntity} from '~/prejudices/prejudices.entities';

@Resolver('User')
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query('user')
  async getUser(@Args('alias') alias: string): Promise<UserEntity | null> {
    return this.usersService.getByAlias(alias);
  }
}
