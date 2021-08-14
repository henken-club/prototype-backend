import {Field, ObjectType, ArgsType, ID} from '@nestjs/graphql';

import {AuthorEntity} from '../authors.entities';

@ArgsType()
export class FindAuthorArgs {
  @Field(() => ID)
  id!: string;
}

@ObjectType()
export class FindAuthorPayload {
  @Field(() => AuthorEntity, {nullable: true})
  author!: AuthorEntity | null;
}
