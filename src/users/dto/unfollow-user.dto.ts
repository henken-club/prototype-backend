import {ArgsType, Field, ID, ObjectType} from '@nestjs/graphql';

import {UserEntity} from '../users.entities';

@ArgsType()
export class UnfollowUserArgs {
  @Field(() => ID)
  id!: string;
}

@ObjectType()
export class UnfollowUserPayload {
  @Field(() => UserEntity)
  from!: UserEntity;

  @Field(() => UserEntity)
  to!: UserEntity;
}
