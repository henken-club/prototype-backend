import {ArgsType, Field, ID, Int, ObjectType} from '@nestjs/graphql';
import {Min} from 'class-validator';

import {PrejudiceEntity} from '../prejudices.entities';

@ArgsType()
export class FindPrejudiceArgs {
  @Field(() => Int)
  @Min(1)
  number!: number;

  @Field(() => ID)
  posted!: string;

  @Field(() => ID)
  received!: string;
}

@ObjectType()
export class FindPrejudicePayload {
  @Field(() => PrejudiceEntity, {nullable: true})
  prejudice!: PrejudiceEntity | null;
}
