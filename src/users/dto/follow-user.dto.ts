import {ArgsType, Field, ID, ObjectType} from '@nestjs/graphql';

import {UserEntity} from '../users.entities';

@ArgsType()
export class FollowUserArgs {
  @Field(() => ID)
  id!: string;
}

@ObjectType()
export class FollowUserPayload {
  @Field(() => UserEntity)
  from!: UserEntity;

  @Field(() => UserEntity)
  to!: UserEntity;
}
