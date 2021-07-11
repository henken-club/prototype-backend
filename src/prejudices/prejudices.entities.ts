import {Prejudice} from '~/graphql';
import {Connection} from '~/common/common.entities';

export {
  PrejudiceOrder,
  PrejudiceOrderField,
  CreatePrejudiceInput,
} from '~/graphql';

export type PrejudiceEntity = Omit<
  Prejudice,
  'book' | 'from' | 'to' | 'answer' | 'relatedBooks'
>;
export class PrejudiceConnection extends Connection<PrejudiceEntity> {}
