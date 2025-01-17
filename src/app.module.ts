import {Module, ValidationPipe} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {ConfigModule, ConfigType} from '@nestjs/config';
import {APP_PIPE} from '@nestjs/core';

import {UsersModule} from './users/users.module';
import {GraphQLConfig} from './graphql/graphql.config';
import {PrejudicesModule} from './prejudices/prejudices.module';
import {AnswersModule} from './answers/answers.module';
import {AuthorsModule} from './authors/authors.module';
import {BooksModule} from './books/books.module';
import {AuthModule} from './auth/auth.module';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  imports: [
    GraphQLModule.forRootAsync({
      imports: [ConfigModule.forFeature(GraphQLConfig)],
      inject: [GraphQLConfig.KEY],
      useFactory: (config: ConfigType<typeof GraphQLConfig>) => ({
        playground: config.playground,
        debug: config.debug,
        introspection: config.introspection,
        sortSchema: config.sortSchema,
        autoSchemaFile: config.autoSchemaFile,
        fieldResolverEnhancers: ['guards'],
      }),
    }),
    UsersModule,
    AuthModule,
    PrejudicesModule,
    AnswersModule,
    AuthorsModule,
    BooksModule,
  ],
})
export class AppModule {}
