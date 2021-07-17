import {Module} from '@nestjs/common';

import {IdService} from './id.service';

@Module({
  imports: [],
  providers: [IdService],
  exports: [IdService],
})
export class IdModule {}
