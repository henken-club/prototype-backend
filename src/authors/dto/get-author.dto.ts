import {Field, ObjectType, ArgsType, ID} from '@nestjs/graphql';

import {AuthorEntity} from '../authors.entities';

@ArgsType()
export class GetAuthorArgs {
  @Field(() => ID)
  id!: string;
}

@ObjectType()
export class GetAuthorPayload {
  @Field(() => AuthorEntity, {nullable: true})
  author!: AuthorEntity | null;
}
