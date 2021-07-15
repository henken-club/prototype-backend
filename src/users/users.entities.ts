import {Connection} from '~/common/common.entities';

export {BookOrder, BookOrderField, AddBookInput} from '~/graphql';

export type UserEntity = {id: string};
export class UserConnection extends Connection<UserEntity> {}
export class FollowingConnection {
  nodes!: UserEntity[];
  totalCount!: number;
}
export class FollowerConnection {
  nodes!: UserEntity[];
  totalCount!: number;
}
