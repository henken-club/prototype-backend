import * as path from 'path';

import {Module} from '@nestjs/common';
import {ConfigModule, ConfigType} from '@nestjs/config';
import {GraphQLModule, GraphQLTimestamp} from '@nestjs/graphql';
import {GraphQLDateTime} from 'graphql-scalars';

import {Neo4jConfig} from './neo4j/neo4j.config';
import {Neo4jModule} from './neo4j/neo4j.module';
import {BooksModule} from './books/books.module';

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
    Neo4jModule.forRootAsync({
      imports: [ConfigModule.forFeature(Neo4jConfig)],
      inject: [Neo4jConfig.KEY],
      useFactory: async (config: ConfigType<typeof Neo4jConfig>) => ({
        url: config.url,
        username: config.username,
        password: config.password,
      }),
    }),
    BooksModule,
  ],
})
export class AppModule {}
