import {ArgsType, Field, ObjectType} from '@nestjs/graphql';

@ArgsType()
export class RegisterUserArgs {
  @Field(() => String)
  code!: string;

  @Field(() => String)
  token!: string;
}

@ObjectType()
export class RegisterUserPayload {
  @Field(() => String)
  accessToken!: string;

  @Field(() => String)
  refreshToken!: string;
}
