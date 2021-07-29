import {Connection} from '~/common/common.entities';
import {UserUniqueUnion} from '~/graphql';

export {
  BookOrder,
  BookOrderField,
  AddBookInput,
  FollowUserInput,
  UnfollowUserInput,
  UserUniqueUnion,
} from '~/graphql';

export class UserEntity {
  id!: string;
}
export class FollowEntity {
  from!: UserEntity;
  to!: UserEntity;
}
export class UnfollowEntity {
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
