import {Field, ObjectType, ArgsType, ID} from '@nestjs/graphql';

import {BookEntity} from '../books.entities';

@ArgsType()
export class FindBookArgs {
  @Field(() => ID)
  id!: string;
}

@ObjectType()
export class FindBookPayload {
  @Field(() => BookEntity, {nullable: true})
  book!: BookEntity | null;
}
