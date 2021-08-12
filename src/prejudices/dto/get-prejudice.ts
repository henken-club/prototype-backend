import {ArgsType, Field, ID, Int, ObjectType} from '@nestjs/graphql';
import {Min} from 'class-validator';

import {PrejudiceEntity} from '../prejudices.entities';

@ArgsType()
export class GetPrejudiceArgs {
  @Field(() => Int)
  @Min(1)
  number!: number;

  @Field(() => ID)
  posted!: string;

  @Field(() => ID)
  received!: string;
}

@ObjectType()
export class GetPrejudicePayload {
  @Field(() => PrejudiceEntity, {nullable: true})
  prejudice!: PrejudiceEntity | null;
}
