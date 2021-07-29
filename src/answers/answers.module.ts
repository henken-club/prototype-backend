import {Module} from '@nestjs/common';

import {AnswersResolver} from './answers.resolver';
import {AnswersService} from './answers.service';

import {UsersModule} from '~/users/users.module';
import {Neo4jModule} from '~/neo4j/neo4j.module';
import {PrejudicesModule} from '~/prejudices/prejudices.module';

@Module({
  imports: [Neo4jModule, UsersModule, PrejudicesModule],
  providers: [AnswersResolver, AnswersService],
  exports: [AnswersService],
})
export class AnswersModule {}
