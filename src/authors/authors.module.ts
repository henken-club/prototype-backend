import {Module} from '@nestjs/common';

import {AuthorsResolver} from './authors.resolver';
import {AuthorsService} from './authors.service';

import {IdModule} from '~/id/id.module';

@Module({
  imports: [IdModule],
  providers: [AuthorsResolver, AuthorsService],
  exports: [AuthorsService],
})
export class AuthorsModule {}
