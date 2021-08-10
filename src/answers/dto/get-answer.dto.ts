import {ArgsType, Field, ID, Int, ObjectType} from '@nestjs/graphql';

import {AnswerEntity} from '../answers.entities';

@ArgsType()
export class GetAnswerArgs {
  @Field(() => Int)
  number!: number;

  @Field(() => ID)
  posted!: string;

  @Field(() => ID)
  received!: string;
}

@ObjectType()
export class GetAnswerPayload {
  @Field(() => AnswerEntity, {nullable: true})
  answer!: AnswerEntity | null;
}
