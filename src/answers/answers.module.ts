import {Module} from '@nestjs/common';

import {AnswersResolver} from './answers.resolver';
import {AnswersService} from './answers.service';

import {IdModule} from '~/id/id.module';
import {UsersModule} from '~/users/users.module';
import {Neo4jModule} from '~/neo4j/neo4j.module';

@Module({
  imports: [Neo4jModule, IdModule, UsersModule],
  providers: [AnswersResolver, AnswersService],
  exports: [AnswersService],
})
export class AnswersModule {}
