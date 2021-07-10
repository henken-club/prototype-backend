import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import {PrejudiceEntity} from './prejudices.entities';
import {PrejudicesService} from './prejudices.service';

import {UserEntity} from '~/users/users.entities';

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

  @Query('prejudice')
  async getPrejudice(@Args('id') id: string): Promise<PrejudiceEntity | null> {
    return this.prejudicesService.getById(id);
  }
}
