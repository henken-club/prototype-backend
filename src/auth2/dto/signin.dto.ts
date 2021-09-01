import {ArgsType, Field, ObjectType} from '@nestjs/graphql';
import {IsNotEmpty} from 'class-validator';

@ArgsType()
export class SigninArgs {
  @Field(() => String)
  @IsNotEmpty()
  username!: string;

  @Field(() => String)
  @IsNotEmpty()
  password!: string;
}

@ObjectType()
export class SigninPayload {
  @Field(() => String)
  accessToken!: string;

  @Field(() => String)
  refreshToken!: string;
}
