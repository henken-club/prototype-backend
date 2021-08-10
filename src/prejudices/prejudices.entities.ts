import {
  Field,
  ID,
  ObjectType,
  InputType,
  registerEnumType,
} from '@nestjs/graphql';

import {
  AbstractOrder,
  AbstractArray,
  OrderDirection,
} from '~/common/common.entities';

@ObjectType('Prejudice')
export class PrejudiceEntity {
  @Field((type) => ID)
  id!: string;
}

export enum PrejudiceOrderField {
  CREATED_AT,
}
registerEnumType(PrejudiceOrderField, {
  name: 'PrejudiceOrderField',
});

@InputType()
export class PrejudiceOrder extends AbstractOrder<PrejudiceOrderField> {
  @Field(() => OrderDirection)
  direction!: OrderDirection;

  @Field(() => PrejudiceOrderField)
  field!: PrejudiceOrderField;
}

@ObjectType()
export class PrejudiceArray extends AbstractArray<PrejudiceEntity> {
  @Field((type) => [PrejudiceEntity])
  nodes!: PrejudiceEntity[];
}

export enum PrejudicePostRule {
  ALL_FOLLOWERS = 'ALL_FOLLOWERS',
  MUTUAL_ONLY = 'MUTUAL_ONLY',
}
