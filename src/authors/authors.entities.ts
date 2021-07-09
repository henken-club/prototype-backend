import {Connection} from '../common/common.entities';

import {Author} from '~/graphql';

export {AuthorOrderField, AuthorOrder} from '~/graphql';

export type AuthorEntity = Omit<Author, 'writedBooks'>;
export class AuthorConnection extends Connection<AuthorEntity> {}
