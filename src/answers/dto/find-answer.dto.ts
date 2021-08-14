import {ArgsType, Field, ID, Int, ObjectType} from '@nestjs/graphql';
import {Min} from 'class-validator';

import {AnswerEntity} from '../answers.entities';

@ArgsType()
export class FindAnswerArgs {
  @Field(() => Int)
  @Min(1)
  number!: number;

  @Field(() => ID)
  posted!: string;

  @Field(() => ID)
  received!: string;
}

@ObjectType()
export class FindAnswerPayload {
  @Field(() => AnswerEntity, {nullable: true})
  answer!: AnswerEntity | null;
}
