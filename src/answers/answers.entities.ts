import {OrderDirection, Connection} from '~/common/common.entities';
import {PrejudiceEntity} from '~/prejudices/prejudices.entities';

export enum Correctness {
  CORRECT = 'CORRECT',
  INCORRECT = 'INCORRECT',
  PARTLY_CORRECT = 'PARTLY_CORRECT',
}

export type AnswerOrder = {
  direction: OrderDirection;
  field: AnswerOrderField;
};

export enum AnswerOrderField {
  CREATED_AT = 'CREATED_AT',
}
export type AnswerEntity = {id: string};
export class AnswerConnection extends Connection<AnswerEntity> {}

export type GetPrejudiceInput = {
  number: number;
  posted: UserUniqueUnion;
  received: UserUniqueUnion;
};

export type UserUniqueUnion = {
  alias?: string;
  id?: string;
};

export type GetAnswerPayload = {
  possibility: boolean;
  answer: AnswerEntity | null;
};

export type PostAnswerInput = {
  prejudiceId: string;
};

export type PostPrejudicePayload = {
  prejudice: PrejudiceEntity;
};
