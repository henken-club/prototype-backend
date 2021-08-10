import {ArgsType, Field, ID, ObjectType} from '@nestjs/graphql';

import {UserEntity} from '../users.entities';

@ArgsType()
export class GetUserArgs {
  @Field(() => ID)
  alias!: string;
}

@ObjectType()
export class GetUserResult {
  @Field(() => UserEntity, {nullable: true})
  user!: UserEntity | null;
}
