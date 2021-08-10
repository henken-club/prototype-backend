import {registerEnumType} from '@nestjs/graphql';

export abstract class Connection<T> {
  nodes!: T[];
}

export enum OrderDirection {
  ASC,
  DESC,
}
registerEnumType(OrderDirection, {
  name: 'OrderDirection',
});
