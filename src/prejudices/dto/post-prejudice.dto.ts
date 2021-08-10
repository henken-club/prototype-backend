import {ArgsType, Field, ID, ObjectType} from '@nestjs/graphql';

import {PrejudiceEntity} from '../prejudices.entities';

@ArgsType()
export class PostPrejudiceArgs {
  @Field(() => ID)
  userId!: string;

  @Field(() => [ID]!)
  relatedBooks!: string[];

  @Field(() => String)
  title!: string;
}

@ObjectType()
export class PostPrejudicePayload {
  @Field(() => PrejudiceEntity)
  prejudice!: PrejudiceEntity;
}
