import {Book, AuthorConnection, User} from '~/graphql';
import {Connection} from '~/common/common.entities';

export {BookOrder, BookOrderField, AddBookInput} from '~/graphql';

export type UserEntity = Omit<
  User,
  | 'following'
  | 'followers'
  | 'postPreduices'
  | 'recievedPreduices'
  | 'postAnswers'
  | 'recievedAnswers'
>;
export class UserConnection extends Connection<UserEntity> {}
