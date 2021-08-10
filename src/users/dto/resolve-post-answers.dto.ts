import {ArgsType, Field, Int} from '@nestjs/graphql';

import {AnswerOrder, AnswerOrderField} from '../../answers/answers.entities';

import {OrderDirection} from '~/common/common.entities';

@ArgsType()
export class ResolvePostAnswersArgs {
  @Field(() => Int, {defaultValue: 0, nullable: true})
  skip!: number;

  @Field(() => Int, {defaultValue: 10, nullable: true})
  limit!: number;

  @Field(() => AnswerOrder, {
    defaultValue: {
      direction: OrderDirection.DESC,
      field: AnswerOrderField.CREATED_AT,
    },
    nullable: true,
  })
  orderBy!: AnswerOrder;
}
