import {ArgsType, Field, ID, ObjectType} from '@nestjs/graphql';

import {BookEntity} from '../books.entities';

@ArgsType()
export class AddBookArgs {
  @Field(() => [ID])
  authors!: string[];

  @Field(() => String)
  title!: string;
}

@ObjectType()
export class AddBookPayload {
  @Field(() => BookEntity)
  book!: BookEntity;
}
