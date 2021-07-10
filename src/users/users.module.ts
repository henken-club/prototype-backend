import {Module} from '@nestjs/common';

import {UsersResolver} from './users.resolver';
import {UsersService} from './users.service';

import {IdModule} from '~/id/id.module';

@Module({
  imports: [IdModule],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
