import {ArgsType, Field} from '@nestjs/graphql';

import {AnswerOrder, AnswerOrderField} from '../../answers/answers.entities';

import {OrderDirection, OffsetPaginationArgs} from '~/common/common.entities';

@ArgsType()
export class ResolvePostAnswersArgs extends OffsetPaginationArgs {
  @Field(() => AnswerOrder, {
    defaultValue: {
      direction: OrderDirection.DESC,
      field: AnswerOrderField.CREATED_AT,
    },
    nullable: true,
  })
  orderBy!: AnswerOrder;
}
