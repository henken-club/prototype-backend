import {ArgsType, Field, ID} from '@nestjs/graphql';

export class AddBookInput {
  title!: string;
}
