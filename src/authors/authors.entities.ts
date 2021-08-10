import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

import {OrderDirection} from '~/common/common.entities';

@ObjectType('Author')
export class AuthorEntity {
  @Field((type) => ID)
  id!: string;

  @Field((type) => String)
  name!: string;
}
export enum AuthorOrderField {
  NAME,
}
registerEnumType(AuthorOrderField, {
  name: 'AuthorOrderField',
});

@InputType()
export class AuthorOrder {
  @Field(() => OrderDirection)
  direction!: OrderDirection;

  @Field(() => AuthorOrderField)
  field!: AuthorOrderField;
}

@ObjectType()
export class AuthorArray {
  @Field((type) => [AuthorEntity])
  nodes!: AuthorEntity[];

  /*
  @Field((type) => Int)
  totalCount!: number;
*/
}
