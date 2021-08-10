import {ArgsType, Field, ObjectType} from '@nestjs/graphql';

import {AuthorEntity} from '../authors.entities';

@ArgsType()
export class AddAuthorArgs {
  @Field(() => String)
  name!: string;
}

@ObjectType()
export class AddAuthorPayload {
  @Field(() => AuthorEntity)
  author!: AuthorEntity;
}
