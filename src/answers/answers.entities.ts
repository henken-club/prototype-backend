import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

import {OrderDirection} from '~/common/common.entities';
import {PrejudiceOrderField} from '~/prejudices/prejudices.entities';

@ObjectType('Answer')
export class AnswerEntity {
  @Field(() => ID)
  id!: string;
}

export enum AnswerOrderField {
  CREATED_AT,
}
registerEnumType(AnswerOrderField, {
  name: 'AnswerOrderField',
});

@InputType()
export class AnswerOrder {
  @Field(() => OrderDirection)
  direction!: OrderDirection;

  @Field(() => PrejudiceOrderField)
  field!: AnswerOrderField;
}

@ObjectType()
export class AnswerArray {
  @Field((type) => [AnswerEntity])
  nodes!: AnswerEntity[];

  /*
  @Field((type) => Int)
  totalCount!: number;
*/
}

export enum AnswerCorrectness {
  CORRECT,
  INCORRECT,
  PARTLY_CORRECT,
}
registerEnumType(AnswerCorrectness, {
  name: 'AnswerCorrectness',
});
