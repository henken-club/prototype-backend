import {ArgsType, Field, ObjectType} from '@nestjs/graphql';

import {TokenEntities} from '../auth.entities';

@ArgsType()
export class SignUpArgs {
  @Field(() => String)
  alias!: string;

  @Field(() => String)
  displayName!: string;

  @Field(() => String)
  password!: string;
}

@ObjectType()
export class SignUpPayload {
  @Field(() => TokenEntities)
  tokens!: TokenEntities;
}
