import {Answer} from '~/graphql';
import {Connection} from '~/common/common.entities';

export {
  Correctness,
  AnswerOrder,
  AnswerOrderField,
  PostAnswerInput,
  PostPrejudicePayload,
} from '~/graphql';

export type AnswerEntity = Omit<Answer, 'prejudiceTo'>;
export class AnswerConnection extends Connection<AnswerEntity> {}
