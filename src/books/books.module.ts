import {Module} from '@nestjs/common';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {ConfigModule, ConfigType} from '@nestjs/config';

import {BooksResolver} from './books.resolver';
import {BooksService} from './books.service';

import {IdModule} from '~/id/id.module';
import {Neo4jModule} from '~/neo4j/neo4j.module';
import {AuthorsModule} from '~/authors/authors.module';
import {BookcoverConfig} from '~/services/bookcover.config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'BookcoverClient',
        imports: [ConfigModule.forFeature(BookcoverConfig)],
        inject: [BookcoverConfig.KEY],
        useFactory: async (config: ConfigType<typeof BookcoverConfig>) => ({
          transport: Transport.GRPC,
          options: config.options,
        }),
      },
    ]),
    Neo4jModule,
    IdModule,
    AuthorsModule,
  ],
  providers: [BooksResolver, BooksService],
  exports: [BooksService],
})
export class BooksModule {}
