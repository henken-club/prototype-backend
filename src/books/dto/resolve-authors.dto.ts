import {ArgsType, Field} from '@nestjs/graphql';

import {AuthorOrder, AuthorOrderField} from '~/authors/authors.entities';
import {OrderDirection, OffsetPaginationArgs} from '~/common/common.entities';

@ArgsType()
export class ResolveAuthorsArgs extends OffsetPaginationArgs {
  @Field(() => AuthorOrder, {
    defaultValue: {
      direction: OrderDirection.DESC,
      field: AuthorOrderField.NAME,
    },
    nullable: true,
  })
  orderBy!: AuthorOrder;
}
