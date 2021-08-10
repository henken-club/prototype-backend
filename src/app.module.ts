import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {ConfigModule, ConfigType} from '@nestjs/config';

import {UsersModule} from './users/users.module';
import {GraphQLConfig} from './graphql/graphql.config';

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
  ],
})
export class AppModule {}
