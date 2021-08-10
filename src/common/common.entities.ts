import {ArgsType, Field, Int, registerEnumType} from '@nestjs/graphql';

export enum OrderDirection {
  ASC,
  DESC,
}
registerEnumType(OrderDirection, {
  name: 'OrderDirection',
});

export abstract class AbstractOrder<T> {
  abstract direction: OrderDirection;

  abstract field: T;
}

export abstract class AbstractArray<T> {
  abstract nodes: T[];
}

@ArgsType()
export abstract class OffsetPaginationArgs {
  @Field(() => Int, {defaultValue: 0, nullable: true})
  skip!: number;

  @Field(() => Int, {defaultValue: 10, nullable: true})
  limit!: number;
}
