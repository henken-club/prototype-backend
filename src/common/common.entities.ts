import {ArgsType, Field, Int, registerEnumType} from '@nestjs/graphql';
import {Max, Min} from 'class-validator';

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
  @Min(0)
  skip!: number;

  @Field(() => Int, {defaultValue: 10, nullable: true})
  @Min(1)
  @Max(20)
  limit!: number;
}
