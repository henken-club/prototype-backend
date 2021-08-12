import {ArgsType, Field} from '@nestjs/graphql';
import {IsNotEmpty} from 'class-validator';

import {OffsetPaginationArgs} from '~/common/common.entities';

@ArgsType()
export class SearchAuthorsArgs extends OffsetPaginationArgs {
  @Field(() => String)
  @IsNotEmpty()
  query!: string;
}
