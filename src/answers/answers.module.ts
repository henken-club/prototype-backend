import {Module} from '@nestjs/common';

import {AnswersResolver} from './answers.resolver';
import {AnswersService} from './answers.service';

import {IdModule} from '~/id/id.module';

@Module({
  imports: [IdModule],
  providers: [AnswersResolver, AnswersService],
  exports: [AnswersService],
})
export class AnswersModule {}
