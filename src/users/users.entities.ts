import {Field, ID, Int, ObjectType} from '@nestjs/graphql';

@ObjectType('User')
export class UserEntity {
  @Field((type) => ID)
  id!: string;
}

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
