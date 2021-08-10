import {Field, registerEnumType} from '@nestjs/graphql';

import {OrderDirection} from './OrderDirection';

export enum PrejudiceOrderField {
  CREATED_AT,
}
registerEnumType(PrejudiceOrderField, {
  name: 'PrejudiceOrderField',
});

export class PrejudiceOrder {
  @Field(() => OrderDirection)
  direction!: OrderDirection;

  @Field(() => PrejudiceOrderField)
  field!: PrejudiceOrderField;
}
