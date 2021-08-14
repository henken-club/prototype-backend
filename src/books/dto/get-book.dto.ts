import {Field, ObjectType, ArgsType, ID} from '@nestjs/graphql';

import {BookEntity} from '../books.entities';

@ArgsType()
export class GetBookArgs {
  @Field(() => ID)
  id!: string;
}

@ObjectType()
export class GetBookPayload {
  @Field(() => BookEntity, {nullable: true})
  book!: BookEntity | null;
}
