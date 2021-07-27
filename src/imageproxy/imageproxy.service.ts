import {Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';

import {ImageproxyConfig} from './imageproxy.config';

@Injectable()
export class ImageproxyService {
  constructor(
    @Inject(ImageproxyConfig.KEY)
    private readonly config: ConfigType<typeof ImageproxyConfig>,
  ) {}

  proxy(url: string): string {
    return `${this.config.url}/${url}`;
  }
}
