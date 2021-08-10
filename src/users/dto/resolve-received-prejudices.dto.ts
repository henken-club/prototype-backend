import {ArgsType, Field} from '@nestjs/graphql';

import {OrderDirection, OffsetPaginationArgs} from '~/common/common.entities';
import {
  PrejudiceOrder,
  PrejudiceOrderField,
} from '~/prejudices/prejudices.entities';

@ArgsType()
export class ResolveReceivedPrejudicesArgs extends OffsetPaginationArgs {
  @Field(() => PrejudiceOrder, {
    defaultValue: {
      direction: OrderDirection.DESC,
      field: PrejudiceOrderField.CREATED_AT,
    },
    nullable: true,
  })
  orderBy!: PrejudiceOrder;
}
