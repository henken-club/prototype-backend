import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import {AnswersService} from './answers.service';
import {AnswerEntity} from './answers.entities';

import {UserEntity} from '~/users/users.entities';
import {PrejudiceEntity} from '~/prejudices/prejudices.entities';

@Resolver('Answer')
export class AnswersResolver {
  constructor(private prejudicesService: AnswersService) {}

  @ResolveField('prejudice')
  async getPrejudice(@Parent() {id}: AnswerEntity): Promise<PrejudiceEntity> {
    return this.prejudicesService.getPrejudice(id);
  }

  @Query('answer')
  async getAnswer(@Args('id') id: string): Promise<AnswerEntity | null> {
    return this.prejudicesService.getById(id);
  }
}