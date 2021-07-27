import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';

import {ImageproxyConfig} from './imageproxy.config';
import {ImageproxyService} from './imageproxy.service';

@Module({
  imports: [ConfigModule.forFeature(ImageproxyConfig)],
  providers: [ImageproxyService],
  exports: [ImageproxyService],
})
export class ImageproxyModule {}
