import {ArgsType, Field, ID, ObjectType} from '@nestjs/graphql';
import {ArrayNotEmpty, IsISBN, IsNotEmpty, IsOptional} from 'class-validator';

import {BookEntity} from '../books.entities';

@ArgsType()
export class AddBookArgs {
  @Field(() => [ID])
  @ArrayNotEmpty()
  authors!: string[];

  @Field(() => String)
  @IsNotEmpty()
  title!: string;

  @Field(() => String, {nullable: true})
  @IsOptional()
  @IsISBN()
  isbn?: string;
}

@ObjectType()
export class AddBookPayload {
  @Field(() => BookEntity)
  book!: BookEntity;
}
