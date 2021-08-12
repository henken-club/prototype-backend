import {ArgsType, Field, ObjectType} from '@nestjs/graphql';
import {IsNotEmpty} from 'class-validator';

import {AuthorEntity} from '../authors.entities';

@ArgsType()
export class AddAuthorArgs {
  @Field(() => String)
  @IsNotEmpty()
  name!: string;
}

@ObjectType()
export class AddAuthorPayload {
  @Field(() => AuthorEntity)
  author!: AuthorEntity;
}
