import {UserUniqueUnion} from '~/answers/answers.entities';
import {Connection} from '~/common/common.entities';

export class UserEntity {
  id!: string;
}
export class FollowUserPayload {
  from!: UserEntity;
  to!: UserEntity;
}
export class UnfollowUserPayload {
  from!: UserEntity;
  to!: UserEntity;
}

export type GetUserInput = UserUniqueUnion;
export type GetUserResult = {
  user: UserEntity | null;
};

export class UserConnection extends Connection<UserEntity> {}
export class FollowingConnection {
  nodes!: UserEntity[];
  totalCount!: number;
}
export class FollowerConnection {
  nodes!: UserEntity[];
  totalCount!: number;
}

export type FollowUserInput = {
  user: GetUserInput;
};

export type UnfollowUserInput = {
  user: GetUserInput;
};
