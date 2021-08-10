import {ArgsType, Field, ObjectType} from '@nestjs/graphql';

import {TokenEntities} from '../auth.entities';

@ArgsType()
export class RefreshTokenArgs {
  @Field(() => String)
  token!: string;
}

@ObjectType()
export class RefreshTokenPayload {
  @Field(() => TokenEntities)
  tokens!: TokenEntities;
}
