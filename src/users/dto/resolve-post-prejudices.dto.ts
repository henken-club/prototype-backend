import {ArgsType, Field, Int} from '@nestjs/graphql';

import {OrderDirection} from './OrderDirection';
import {PrejudiceOrder, PrejudiceOrderField} from './PrejudiceOrderField';

@ArgsType()
export class ResolvePostPrejudicesArgsType {
  @Field(() => Int, {defaultValue: 0, nullable: true})
  skip!: number;

  @Field(() => Int, {defaultValue: 10, nullable: true})
  limit!: number;

  @Field(() => PrejudiceOrder, {
    defaultValue: {
      direction: OrderDirection.DESC,
      field: PrejudiceOrderField.CREATED_AT,
    },
    nullable: true,
  })
  orderBy!: PrejudiceOrder;
}
