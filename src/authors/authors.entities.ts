import {Connection} from '../common/common.entities';

import {Author} from '~/graphql';

export {AuthorOrderField, AuthorOrder, AddAuthorInput} from '~/graphql';

export type AuthorEntity = Omit<Author, 'writedBooks' | 'userResponsibleFor'>;
export class AuthorConnection extends Connection<AuthorEntity> {}

export class AddAuthorPayload {
  author!: AuthorEntity;
}
