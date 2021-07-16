import * as path from 'path';

import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {GraphQLDateTime} from 'graphql-scalars';

import {BooksModule} from './books/books.module';
import {AuthorsModule} from './authors/authors.module';
import {UsersModule} from './users/users.module';
import {PrejudicesModule} from './prejudices/prejudices.module';
import {AnswersModule} from './answers/answers.module';
import {AuthModule} from './auth/auth.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['src/*/*.graphql'],
      resolvers: {DateTime: GraphQLDateTime},
      definitions: {
        path: path.resolve(process.cwd(), 'src/graphql.ts'),
        customScalarTypeMapping: {
          DateTime: 'Date',
        },
      },
    }),
    AnswersModule,
    AuthModule,
    AuthorsModule,
    BooksModule,
    PrejudicesModule,
    UsersModule,
  ],
})
export class AppModule {}
