import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

import {AuthorOrderField} from '~/authors/authors.entities';
import {Connection, OrderDirection} from '~/common/common.entities';

@ObjectType('Book')
export class BookEntity {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  title!: string;
}
export class BookConnection extends Connection<BookEntity> {}

export enum BookOrderField {
  TITLE,
}
registerEnumType(BookOrderField, {
  name: 'BookOrderField',
});

@InputType()
export class BookOrder {
  @Field(() => OrderDirection)
  direction!: OrderDirection;

  @Field(() => AuthorOrderField)
  field!: BookOrderField;
}

@ObjectType()
export class BookArray {
  @Field((type) => [BookEntity])
  nodes!: BookEntity[];
}
