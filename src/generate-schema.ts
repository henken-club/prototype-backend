import * as fs from 'fs';
import {promisify} from 'util';
import * as path from 'path';

import {NestFactory} from '@nestjs/core';
import {
  GraphQLSchemaBuilderModule,
  GraphQLSchemaFactory,
} from '@nestjs/graphql';
import {printSchema} from 'graphql';

import {AnswersResolver} from './answers/answers.resolver';
import {AuthResolver} from './auth/auth.resolver';
import {AuthorsResolver} from './authors/authors.resolver';
import {BooksResolver} from './books/books.resolver';
import {PrejudicesResolver} from './prejudices/prejudices.resolver';
import {UsersResolver} from './users/users.resolver';

async function bootstrap() {
  const app = await NestFactory.create(GraphQLSchemaBuilderModule);
  await app.init();

  const gqlSchemaFactory = app.get(GraphQLSchemaFactory);
  const schema = await gqlSchemaFactory.create([
    UsersResolver,
    AuthResolver,
    PrejudicesResolver,
    AnswersResolver,
    AuthorsResolver,
    BooksResolver,
  ]);

  await promisify(fs.writeFile)(
    path.resolve(process.cwd(), 'src/schema.graphql'),
    printSchema(schema),
  );

  await app.close();
}
bootstrap();
