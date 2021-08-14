import {ArgsType, Field, ID, ObjectType} from '@nestjs/graphql';
import {ArrayNotEmpty, IsNotEmpty} from 'class-validator';

import {BookEntity} from '../books.entities';

@ArgsType()
export class AddBookArgs {
  @Field(() => [ID])
  @ArrayNotEmpty()
  authors!: string[];

  @Field(() => String)
  @IsNotEmpty()
  title!: string;
}

@ObjectType()
export class AddBookPayload {
  @Field(() => BookEntity)
  book!: BookEntity;
}
