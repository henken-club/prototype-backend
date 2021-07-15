import {Module} from '@nestjs/common';

import {PrejudicesResolver} from './prejudices.resolver';
import {PrejudicesService} from './prejudices.service';

import {IdModule} from '~/id/id.module';
import {UsersModule} from '~/users/users.module';

@Module({
  imports: [IdModule, UsersModule],
  providers: [PrejudicesResolver, PrejudicesService],
  exports: [PrejudicesService],
})
export class PrejudicesModule {}
