import {ArgsType, Field, ObjectType} from '@nestjs/graphql';
import {IsNotEmpty} from 'class-validator';

import {TokenEntities} from '../auth.entities';

@ArgsType()
export class LoginArgs {
  @Field(() => String)
  @IsNotEmpty()
  alias!: string;

  @Field(() => String)
  @IsNotEmpty()
  password!: string;
}

@ObjectType()
export class LoginPayload {
  @Field(() => TokenEntities)
  tokens!: TokenEntities;
}
