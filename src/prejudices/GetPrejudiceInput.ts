import {ArgsType, Field, ID, Int, ObjectType} from '@nestjs/graphql';

import {PrejudiceEntity} from './prejudices.entities';

@ArgsType()
export class GetPrejudiceArgs {
  @Field(() => Int)
  number!: number;

  @Field(() => ID)
  posted!: string;

  @Field(() => ID)
  received!: string;
}

@ObjectType()
export class GetPrejudiceResult {
  @Field(() => PrejudiceEntity, {nullable: true})
  prejudice!: PrejudiceEntity | null;
}
