import {ArgsType, Field, ObjectType} from '@nestjs/graphql';

@ArgsType()
export class ResendVerificationEmailArgs {
  @Field(() => String)
  token!: string;
}

@ObjectType()
export class ResendVerificationEmailPayload {
  @Field(() => Boolean)
  success!: boolean;
}
