import {Prejudice} from '~/graphql';
import {Connection} from '~/common/common.entities';

export {
  PrejudiceOrder,
  PrejudiceOrderField,
  PostPrejudiceInput,
  GetPrejudiceInput,
} from '~/graphql';

export type PrejudiceEntity = Omit<
  Prejudice,
  'book' | 'userFrom' | 'userTo' | 'answeredBy' | 'relatedBooks'
>;
export class PrejudiceConnection extends Connection<PrejudiceEntity> {}

export class PostPrejudicePayload {
  prejudice!: PrejudiceEntity;
}
