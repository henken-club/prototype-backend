import {Injectable} from '@nestjs/common';
import {customAlphabet} from 'nanoid';

@Injectable()
export class IdService {
  private generator;

  constructor() {
    this.generator = customAlphabet(
      '123456789abcdefghijkmnopqrstuvwxyz' /* cspell: disable-line */,
      16,
    );
  }

  createId(): string {
    return this.generator();
  }
}
