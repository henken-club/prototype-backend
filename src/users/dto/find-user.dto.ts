import {ArgsType, Field, ID, ObjectType} from '@nestjs/graphql';
import {IsNotEmpty} from 'class-validator';

import {UserEntity} from '../users.entities';

@ArgsType()
export class FindUserArgs {
  @Field(() => ID)
  @IsNotEmpty()
  alias!: string;
}

@ObjectType()
export class FindUserResult {
  @Field(() => UserEntity, {nullable: true})
  user!: UserEntity | null;
}
