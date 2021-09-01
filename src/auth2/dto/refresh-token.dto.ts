import {ArgsType, Field, ObjectType} from '@nestjs/graphql';

@ArgsType()
export class RefreshTokenArgs {
  @Field(() => String)
  refreshToken!: string;
}

@ObjectType()
export class RefreshTokenPayload {
  @Field(() => String)
  accessToken!: string;

  @Field(() => String)
  refreshToken!: string;
}
