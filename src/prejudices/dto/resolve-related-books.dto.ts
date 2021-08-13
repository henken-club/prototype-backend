import {ArgsType, Field} from '@nestjs/graphql';

import {BookOrder, BookOrderField} from '~/books/books.entities';
import {OffsetPaginationArgs, OrderDirection} from '~/common/common.entities';

@ArgsType()
export class ResolveRelatedBooksArgs extends OffsetPaginationArgs {
  @Field(() => BookOrder, {
    defaultValue: {
      direction: OrderDirection.DESC,
      field: BookOrderField.TITLE,
    },
    nullable: true,
  })
  orderBy!: BookOrder;
}
