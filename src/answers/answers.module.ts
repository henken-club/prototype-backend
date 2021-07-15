import {Module} from '@nestjs/common';

import {AnswersResolver} from './answers.resolver';
import {AnswersService} from './answers.service';

import {IdModule} from '~/id/id.module';
import {UsersModule} from '~/users/users.module';

@Module({
  imports: [IdModule, UsersModule],
  providers: [AnswersResolver, AnswersService],
  exports: [AnswersService],
})
export class AnswersModule {}
