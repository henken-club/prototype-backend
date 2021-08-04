import {createHmac} from 'crypto';
import {URL} from 'url';

import {Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';

import {ImgproxyConfig} from './imgproxy.config';
import {ImgproxyOption} from './imgproxy.types';

@Injectable()
export class ImgproxyService {
  private hexDecodedKey;
  private hexDecodedSalt;

  constructor(
    @Inject(ImgproxyConfig.KEY)
    private readonly config: ConfigType<typeof ImgproxyConfig>,
  ) {
    this.hexDecodedKey = Buffer.from(this.config.key, 'hex');
    this.hexDecodedSalt = Buffer.from(this.config.salt, 'hex');
  }

  createPath(source: string, option?: ImgproxyOption) {
    const processPart =
      option && 'process' in option
        ? (`${option.process.resizingType}/${option.process.width}/${option.process.height}/${option.process.gravity}/${option.process.enlarge}` as const)
        : ('' as const);
    const sourcePart = Buffer.from(source).toString('base64url');
    const extensionPart =
      option && 'extension' in option ? `.${option.extension}` : '';
    return `${processPart}/${sourcePart}${extensionPart}` as const;
  }

  sign(path: string) {
    return createHmac('sha256', this.hexDecodedKey)
      .update(this.hexDecodedSalt)
      .update(path)
      .digest()
      .toString('base64url');
  }

  proxy(source: string, option?: ImgproxyOption): string {
    const path = this.createPath(source, option);
    const signature = this.sign(path);

    return new URL(`/${signature}${path}`, this.config.baseUrl).toString();
  }
}
