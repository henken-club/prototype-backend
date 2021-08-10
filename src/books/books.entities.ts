import {Connection, OrderDirection} from '~/common/common.entities';

export type BookEntity = {
  id: string;
  title: string;
};
export class BookConnection extends Connection<BookEntity> {}

export class AddBookPayload {
  book!: BookEntity;
}

export type BookOrder = {
  direction: OrderDirection;
  field: BookOrderField;
};

export enum BookOrderField {
  TITLE = 'TITLE',
}

export type AddBookInput = {
  authors: string[];
  title: string;
};
