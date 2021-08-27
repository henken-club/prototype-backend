import {ArgsType, Field, ObjectType} from '@nestjs/graphql';
import {IsEmail, IsNotEmpty, IsOptional} from 'class-validator';

@ArgsType()
export class CreateTempUserArgs {
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
export class CreateTempUserPayload {
  @Field(() => String)
  token!: string;
}
