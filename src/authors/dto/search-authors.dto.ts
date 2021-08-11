import {ArgsType, Field} from '@nestjs/graphql';

import {OffsetPaginationArgs} from '~/common/common.entities';

@ArgsType()
export class SearchAuthorsArgs extends OffsetPaginationArgs {
  @Field(() => String)
  query!: string;
}
