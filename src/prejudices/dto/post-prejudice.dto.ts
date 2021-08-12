import {ArgsType, Field, ID, ObjectType} from '@nestjs/graphql';
import {IsNotEmpty, MinLength} from 'class-validator';

import {PrejudiceEntity} from '../prejudices.entities';

@ArgsType()
export class PostPrejudiceArgs {
  @Field(() => ID)
  userId!: string;

  @Field(() => [ID]!)
  @MinLength(1)
  relatedBooks!: string[];

  @Field(() => String)
  @IsNotEmpty()
  title!: string;
}

@ObjectType()
export class PostPrejudicePayload {
  @Field(() => PrejudiceEntity)
  prejudice!: PrejudiceEntity;
}
