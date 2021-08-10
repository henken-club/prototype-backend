import {ArgsType} from '@nestjs/graphql';

import {OffsetPaginationArgs} from '~/common/common.entities';

@ArgsType()
export class ResolveFolloweesArgs extends OffsetPaginationArgs {}
