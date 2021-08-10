import {ArgsType, Field, ObjectType} from '@nestjs/graphql';

import {TokenEntities} from '../auth.entities';

@ArgsType()
export class LoginArgs {
  @Field(() => String)
  alias!: string;

  @Field(() => String)
  password!: string;
}

@ObjectType()
export class LoginPayload {
  @Field(() => TokenEntities)
  tokens!: TokenEntities;
}
