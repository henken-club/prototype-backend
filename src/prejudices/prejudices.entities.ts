import {Connection} from '~/common/common.entities';

export {
  PrejudiceOrder,
  PrejudiceOrderField,
  PostPrejudiceInput,
  GetPrejudiceInput,
} from '~/graphql';

export type PrejudiceEntity = {id: string};
export class PrejudiceConnection extends Connection<PrejudiceEntity> {}

export class PostPrejudicePayload {
  prejudice!: PrejudiceEntity;
}
