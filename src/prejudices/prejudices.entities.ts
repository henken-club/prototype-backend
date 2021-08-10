import {UserUniqueUnion} from '~/answers/answers.entities';
import {Connection, OrderDirection} from '~/common/common.entities';

export type PrejudiceEntity = {id: string};
export class PrejudiceConnection extends Connection<PrejudiceEntity> {}

export type GetPrejudiceResult =
  | {possibility: false; prejudice: null}
  | {possibility: true; prejudice: PrejudiceEntity | null};

export class PostPrejudicePayload {
  prejudice!: PrejudiceEntity;
}

export enum PrejudiceOrderField {
  CREATED_AT = 'CREATED_AT',
}

export enum PrejudicePostRule {
  ALL_FOLLOWERS = 'ALL_FOLLOWERS',
  MUTUAL_ONLY = 'MUTUAL_ONLY',
}

export type PrejudiceOrder = {
  direction: OrderDirection;
  field: PrejudiceOrderField;
};

export type PostPrejudiceInput = {
  receivedUser: UserUniqueUnion;
  relatedBooks: string[];
  title: string;
};

export type GetPrejudiceInput = {
  number: number;
  posted: UserUniqueUnion;
  received: UserUniqueUnion;
};
