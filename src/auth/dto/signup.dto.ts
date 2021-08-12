import {ArgsType, Field, ObjectType} from '@nestjs/graphql';
import {IsNotEmpty} from 'class-validator';

import {TokenEntities} from '../auth.entities';

@ArgsType()
export class SignUpArgs {
  @Field(() => String)
  @IsNotEmpty()
  alias!: string;

  @Field(() => String)
  @IsNotEmpty()
  displayName!: string;

  @Field(() => String)
  @IsNotEmpty()
  password!: string;
}

@ObjectType()
export class SignUpPayload {
  @Field(() => TokenEntities)
  tokens!: TokenEntities;
}
