import {
  Field,
  ID,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

import {AuthorOrderField} from '~/authors/authors.entities';
import {
  AbstractArray,
  AbstractOrder,
  OrderDirection,
} from '~/common/common.entities';

@ObjectType('Book')
export class BookEntity {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String, {nullable: true})
  isbn!: string | null;
}

export enum BookOrderField {
  TITLE,
}
registerEnumType(BookOrderField, {
  name: 'BookOrderField',
});

@InputType()
export class BookOrder extends AbstractOrder<BookOrderField> {
  @Field(() => OrderDirection)
  direction!: OrderDirection;

  @Field(() => AuthorOrderField)
  field!: BookOrderField;
}

@ObjectType()
export class BookArray extends AbstractArray<BookEntity> {
  @Field((type) => [BookEntity])
  nodes!: BookEntity[];

  @Field((type) => Int)
  totalCount!: number;
}
