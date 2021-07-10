import {Module} from '@nestjs/common';

import {PrejudicesResolver} from './prejudices.resolver';
import {PrejudicesService} from './prejudices.service';

import {IdModule} from '~/id/id.module';

@Module({
  imports: [IdModule],
  providers: [PrejudicesResolver, PrejudicesService],
  exports: [PrejudicesService],
})
export class PrejudicesModule {}
