import {
  Field,
  ID,
  ObjectType,
  InputType,
  registerEnumType,
} from '@nestjs/graphql';

import {Connection, OrderDirection} from '~/common/common.entities';

@ObjectType('Prejudice')
export class PrejudiceEntity {
  @Field((type) => ID)
  id!: string;
}
export class PrejudiceConnection extends Connection<PrejudiceEntity> {}

export enum PrejudiceOrderField {
  CREATED_AT,
}
registerEnumType(PrejudiceOrderField, {
  name: 'PrejudiceOrderField',
});

@InputType()
export class PrejudiceOrder {
  @Field(() => OrderDirection)
  direction!: OrderDirection;

  @Field(() => PrejudiceOrderField)
  field!: PrejudiceOrderField;
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

export enum PrejudicePostRule {
  ALL_FOLLOWERS = 'ALL_FOLLOWERS',
  MUTUAL_ONLY = 'MUTUAL_ONLY',
}
