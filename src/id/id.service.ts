import {Injectable} from '@nestjs/common';
import {nanoid} from 'nanoid';

@Injectable()
export class IdService {
  constructor() {}

  createId(): string {
    return nanoid(8);
  }
}
