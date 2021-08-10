import {Field, ID, Int, ObjectType} from '@nestjs/graphql';

import {AbstractArray} from '~/common/common.entities';

@ObjectType('User')
export class UserEntity {
  @Field((type) => ID)
  id!: string;
}

@ObjectType()
export class UserArray extends AbstractArray<UserEntity> {
  @Field((type) => [UserEntity])
  nodes!: UserEntity[];
}

@ObjectType()
export class FolloweeArray extends AbstractArray<UserEntity> {
  @Field((type) => [UserEntity])
  nodes!: UserEntity[];

  @Field((type) => Int)
  totalCount!: number;
}

@ObjectType()
export class FollowerArray extends AbstractArray<UserEntity> {
  @Field((type) => [UserEntity])
  nodes!: UserEntity[];

  @Field((type) => Int)
  totalCount!: number;
}
