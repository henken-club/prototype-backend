import {Connection} from '~/common/common.entities';

export {
  Correctness,
  AnswerOrder,
  AnswerOrderField,
  PostAnswerInput,
  PostPrejudicePayload,
  GetPrejudiceInput,
} from '~/graphql';

export type AnswerEntity = {id: string};
export class AnswerConnection extends Connection<AnswerEntity> {}

export type GetAnswerPayload = {
  possibility: boolean;
  answer: AnswerEntity | null;
};
