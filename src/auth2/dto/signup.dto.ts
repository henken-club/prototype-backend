import {ArgsType, Field, ObjectType} from '@nestjs/graphql';
import {IsEmail, IsNotEmpty, IsOptional} from 'class-validator';

@ArgsType()
export class SignUpArgs {
  @Field(() => String)
  @IsEmail()
  email!: string;

  @Field(() => String)
  @IsNotEmpty()
  alias!: string;

  @Field(() => String, {nullable: true})
  @IsOptional()
  @IsNotEmpty()
  displayName!: string | null;

  @Field(() => String)
  @IsNotEmpty()
  password!: string;
}

@ObjectType()
export class SignUpPayload {
  @Field(() => String)
  accessToken!: string;

  @Field(() => String)
  refreshToken!: string;
}
