import {HttpModule} from '@nestjs/axios';
import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';

import {BookcoverProxyConfig} from './bookcover-proxy.config';
import {BookcoverProxyService} from './bookcover-proxy.service';

@Module({
  imports: [ConfigModule.forFeature(BookcoverProxyConfig), HttpModule],
  providers: [BookcoverProxyService],
  exports: [BookcoverProxyService],
})
export class BookcoverProxyModule {}
