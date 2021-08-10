import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {ConfigModule, ConfigType} from '@nestjs/config';

import {UsersModule} from './users/users.module';
import {GraphQLConfig} from './graphql/graphql.config';
import {PrejudicesModule} from './prejudices/prejudices.module';
import {AnswersModule} from './answers/answers.module';
import {AuthorsModule} from './authors/authors.module';

@Module({
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
    PrejudicesModule,
    AnswersModule,
    AuthorsModule,
  ],
})
export class AppModule {}
