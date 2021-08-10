import {Connection} from '../common/common.entities';

import {OrderDirection} from '~/common/common.entities';

export type AuthorEntity = {
  id: string;
  name: string;
};
export class AuthorConnection extends Connection<AuthorEntity> {}

export class AddAuthorPayload {
  author!: AuthorEntity;
}

export enum AuthorOrderField {
  NAME = 'NAME',
}

export class AuthorOrder {
  direction!: OrderDirection;
  field!: AuthorOrderField;
}

export type AddAuthorInput = {
  name: string;
};
