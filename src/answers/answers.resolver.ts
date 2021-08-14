import {Args, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {BadRequestException} from '@nestjs/common';

import {AnswersService} from './answers.service';
import {AnswerEntity, AnswerCorrectness, AnswerArray} from './answers.entities';
import {FindAnswerArgs, FindAnswerPayload} from './dto/find-answer.dto';

import {PrejudiceEntity} from '~/prejudices/prejudices.entities';
import {UsersService} from '~/users/users.service';

@Resolver(() => AnswerEntity)
export class AnswersResolver {
  constructor(
    private readonly answersService: AnswersService,
    private readonly usersService: UsersService,
  ) {}

  @ResolveField(() => String, {name: 'text'})
  async resolveText(@Parent() {id}: AnswerEntity): Promise<string> {
    return this.answersService.resolveText(id);
  }

  @ResolveField(() => Date, {name: 'createdAt'})
  async resolveCreatedAt(@Parent() {id}: AnswerEntity): Promise<Date> {
    return this.answersService.resolveCreatedAt(id);
  }

  @ResolveField(() => AnswerCorrectness, {name: 'correctness'})
  async resolveCorrectness(
    @Parent() {id}: AnswerEntity,
  ): Promise<AnswerCorrectness> {
    return this.answersService.resolveCorrectness(id);
  }

  @ResolveField(() => PrejudiceEntity, {name: 'prejudice'})
  async resolvePrejudice(
    @Parent() {id}: AnswerEntity,
  ): Promise<PrejudiceEntity> {
    return this.answersService.resolvePrejudice(id);
  }

  @Query(() => AnswerEntity, {name: 'answer'})
  async getAnswerById(@Args('id') id: string) {
    return this.answersService.getById(id);
  }

  @Query(() => FindAnswerPayload, {name: 'findAnswer'})
  async findAnswer(
    @Args() {posted, received, number}: FindAnswerArgs,
  ): Promise<FindAnswerPayload> {
    if (posted === received) throw new BadRequestException();
    if (!(await this.usersService.checkExists({id: posted})))
      throw new BadRequestException();
    if (!(await this.usersService.checkExists({id: received})))
      throw new BadRequestException();

    return {
      answer: await this.answersService.getByUserIdAndNumber(
        posted,
        received,
        number,
      ),
    };
  }

  @Query(() => AnswerArray, {name: 'allAnswers'})
  async getAllAnswers(): Promise<AnswerArray> {
    const nodes = await this.answersService.getAll();
    return {nodes};
  }
}
