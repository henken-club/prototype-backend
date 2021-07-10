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

@Resolver('User')
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query('user')
  async getBook(@Args('alias') alias: string): Promise<UserEntity | null> {
    return this.usersService.getByAlias(alias);
  }
}
