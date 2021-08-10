import {Field, ID, ObjectType} from '@nestjs/graphql';

import {Connection} from '~/common/common.entities';

@ObjectType('Prejudice')
export class PrejudiceEntity {
  @Field((type) => ID)
  id!: string;
}
export class PrejudiceConnection extends Connection<PrejudiceEntity> {}

export enum PrejudicePostRule {
  ALL_FOLLOWERS = 'ALL_FOLLOWERS',
  MUTUAL_ONLY = 'MUTUAL_ONLY',
}

@ObjectType()
export class PrejudiceArray {
  @Field((type) => [PrejudiceEntity])
  nodes!: PrejudiceEntity[];

  /*
  @Field((type) => Int)
  totalCount!: number;
*/
}
