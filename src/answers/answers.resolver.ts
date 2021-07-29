import {Args, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {BadRequestException} from '@nestjs/common';

import {AnswersService} from './answers.service';
import {AnswerEntity, Correctness, GetAnswerPayload} from './answers.entities';

import {
  GetPrejudiceInput,
  PrejudiceEntity,
} from '~/prejudices/prejudices.entities';
import {UsersService} from '~/users/users.service';
import {PrejudicesService} from '~/prejudices/prejudices.service';

@Resolver('Answer')
export class AnswersResolver {
  constructor(
    private readonly answersService: AnswersService,
    private readonly prejudiceService: PrejudicesService,
    private readonly usersService: UsersService,
  ) {}

  @ResolveField('text')
  async resolveText(@Parent() {id}: AnswerEntity): Promise<string> {
    return this.answersService.resolveText(id);
  }

  @ResolveField('createdAt')
  async resolveCreatedAt(@Parent() {id}: AnswerEntity): Promise<Date> {
    return this.answersService.resolveCreatedAt(id);
  }

  @ResolveField('correctness')
  async resolveCorrectness(@Parent() {id}: AnswerEntity): Promise<Correctness> {
    return this.answersService.resolveCorrectness(id);
  }

  @ResolveField('prejudice')
  async resolvePrejudice(
    @Parent() {id}: AnswerEntity,
  ): Promise<PrejudiceEntity> {
    return this.answersService.resolvePrejudice(id);
  }

  @Query('answer')
  async getAnswerById(@Args('id') id: string) {
    return this.answersService.getById(id);
  }

  @Query('getAnswer')
  async getAnswer(
    @Args('input') {post, received, number}: GetPrejudiceInput,
  ): Promise<GetAnswerPayload | null> {
    const postId = await this.usersService.convertUserUniqueUnion(post);
    const receivedId = await this.usersService.convertUserUniqueUnion(received);

    if (!postId || !receivedId) return null;
    if (postId === receivedId) throw new BadRequestException();

    if (
      await this.prejudiceService
        .getByUserIdAndNumber(postId, receivedId, number)
        .then((prejudice) => !prejudice)
    )
      return {
        possibility: false,
        answer: null,
      };
    return {
      possibility: true,
      answer: await this.answersService.getByUserIdAndNumber(
        postId,
        receivedId,
        number,
      ),
    };
  }

  @Query('allAnswers')
  async getAllAnswers(): Promise<AnswerEntity[]> {
    return this.answersService.getAll();
  }
}
