import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {GraphQLDateTime} from 'graphql-scalars';
import {ConfigModule, ConfigType} from '@nestjs/config';

import {BooksModule} from './books/books.module';
import {AuthorsModule} from './authors/authors.module';
import {UsersModule} from './users/users.module';
import {PrejudicesModule} from './prejudices/prejudices.module';
import {AnswersModule} from './answers/answers.module';
import {AuthModule} from './auth/auth.module';
import {GraphQLConfig} from './graphql/graphql.config';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [ConfigModule.forFeature(GraphQLConfig)],
      inject: [GraphQLConfig.KEY],
      useFactory: (config: ConfigType<typeof GraphQLConfig>) => ({
        playground: config.playground,
        debug: config.debug,
        typePaths: config.typePaths,
        introspection: config.introspection,
        resolvers: {
          DateTime: GraphQLDateTime,
        },
        definitions: {
          path: config.definitionPath,
          customScalarTypeMapping: {
            DateTime: 'Date',
          },
        },
        sortSchema: config.sortSchema,
      }),
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
