import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';

import {ImgproxyConfig} from './imgproxy.config';
import {ImgproxyService} from './imgproxy.service';

@Module({
  imports: [ConfigModule.forFeature(ImgproxyConfig)],
  providers: [ImgproxyService],
  exports: [ImgproxyService],
})
export class ImgproxyModule {}
