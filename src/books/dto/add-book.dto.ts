import {ArgsType, Field, ID, ObjectType} from '@nestjs/graphql';
import {IsNotEmpty, MinLength} from 'class-validator';

import {BookEntity} from '../books.entities';

@ArgsType()
export class AddBookArgs {
  @Field(() => [ID])
  @MinLength(1)
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
