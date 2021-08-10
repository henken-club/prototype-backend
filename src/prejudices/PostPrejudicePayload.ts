import {ArgsType, Field, ID, ObjectType} from '@nestjs/graphql';

import {PrejudiceEntity} from './prejudices.entities';

@ObjectType()
export class PostPrejudicePayload {
  @Field(() => PrejudiceEntity)
  prejudice!: PrejudiceEntity;
}

@ArgsType()
export class PostPrejudiceArgs {
  @Field(() => ID)
  userId!: string;

  @Field(() => [ID]!)
  relatedBooks!: string[];

  @Field(() => String)
  title!: string;
}
