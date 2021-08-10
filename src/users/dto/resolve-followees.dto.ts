import {ArgsType, Field, Int} from '@nestjs/graphql';

@ArgsType()
export class ResolveFolloweesArgsType {
  @Field(() => Int, {defaultValue: 0, nullable: true})
  skip!: number;

  @Field(() => Int, {defaultValue: 10, nullable: true})
  limit!: number;
}
