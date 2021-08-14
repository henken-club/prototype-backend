import {URL} from 'url';

import {HttpService} from '@nestjs/axios';
import {Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';
import {lastValueFrom} from 'rxjs';

import {BookcoverProxyConfig} from './bookcover-proxy.config';

@Injectable()
export class BookcoverProxyService {
  constructor(
    @Inject(BookcoverProxyConfig.KEY)
    private readonly config: ConfigType<typeof BookcoverProxyConfig>,
    private readonly httpService: HttpService,
  ) {}

  async getFromISBN(isbn: string): Promise<string | null> {
    return lastValueFrom(
      this.httpService.get<{url: string}>(
        new URL(`/isbn/${isbn}`, this.config.baseUrl).toString(),
      ),
    )
      .then(({data}) => data.url)
      .catch(() => null);
  }
}
