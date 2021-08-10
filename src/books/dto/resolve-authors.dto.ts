import {ArgsType, Field, Int} from '@nestjs/graphql';

import {AuthorOrder, AuthorOrderField} from '~/authors/authors.entities';
import {OrderDirection} from '~/common/common.entities';

@ArgsType()
export class ResolveAuthorsArgs {
  @Field(() => Int, {defaultValue: 0, nullable: true})
  skip!: number;

  @Field(() => Int, {defaultValue: 10, nullable: true})
  limit!: number;

  @Field(() => AuthorOrder, {
    defaultValue: {
      direction: OrderDirection.DESC,
      field: AuthorOrderField.NAME,
    },
    nullable: true,
  })
  orderBy!: AuthorOrder;
}
