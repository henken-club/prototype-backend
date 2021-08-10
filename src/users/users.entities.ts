import {Field, ID, Int, ObjectType} from '@nestjs/graphql';

import {UserUniqueUnion} from '~/answers/answers.entities';
import {Connection} from '~/common/common.entities';

@ObjectType('User')
export class UserEntity {
  @Field((type) => ID)
  id!: string;
}

export type GetUserInput = UserUniqueUnion;
export type GetUserResult = {
  user: UserEntity | null;
};

export class UserConnection extends Connection<UserEntity> {}

@ObjectType()
export class UserArray {
  @Field((type) => [UserEntity])
  nodes!: UserEntity[];
}

@ObjectType()
export class FolloweeArray {
  @Field((type) => [UserEntity])
  nodes!: UserEntity[];

  @Field((type) => Int)
  totalCount!: number;
}

@ObjectType()
export class FollowerArray {
  @Field((type) => [UserEntity])
  nodes!: UserEntity[];

  @Field((type) => Int)
  totalCount!: number;
}
