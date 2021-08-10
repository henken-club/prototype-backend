import {registerEnumType} from '@nestjs/graphql';

export enum OrderDirection {
  ASC,
  DESC,
}
registerEnumType(OrderDirection, {
  name: 'OrderDirection',
});
