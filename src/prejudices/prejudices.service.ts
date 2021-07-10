import {Injectable} from '@nestjs/common';

import {
  CYPHER_GET_PREJUDICE,
  CYPHER_GET_PREJUDICE_ANSWER,
  CYPHER_GET_PREJUDICE_USER_FROM,
  CYPHER_GET_PREJUDICE_USER_TO,
} from './prejudices.cypher';
import {PrejudiceEntity} from './prejudices.entities';

import {Neo4jService} from '~/neo4j/neo4j.service';
import {IdService} from '~/id/id.service';
import {UserEntity} from '~/users/users.entities';
import {AnswerEntity} from '~/answers/answers.entities';

@Injectable()
export class PrejudicesService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly idService: IdService,
  ) {}

  async getById(id: string): Promise<PrejudiceEntity | null> {
    const result = await this.neo4jService.read(CYPHER_GET_PREJUDICE, {
      id,
    });
    if (result.records.length !== 1) return null;

    return {
      id: result.records[0].get('id'),
      title: result.records[0].get('title'),
      createdAt: new Date(result.records[0].get('createdAt')),
    };
  }

  async getUserFrom(id: string): Promise<UserEntity> {
    const result = await this.neo4jService.read(
      CYPHER_GET_PREJUDICE_USER_FROM,
      {
        id,
      },
    );
    if (result.records.length !== 1)
      throw new Error('Prejudice.userFrom broken');

    return {
      id: result.records[0].get('id'),
      alias: result.records[0].get('alias'),
      displayName: result.records[0].get('displayName'),
    };
  }

  async getUserTo(id: string): Promise<UserEntity> {
    const result = await this.neo4jService.read(CYPHER_GET_PREJUDICE_USER_TO, {
      id,
    });
    if (result.records.length !== 1) throw new Error('Prejudice.userTo broken');

    return {
      id: result.records[0].get('id'),
      alias: result.records[0].get('alias'),
      displayName: result.records[0].get('displayName'),
    };
  }

  async getAnswer(id: string): Promise<AnswerEntity> {
    const result = await this.neo4jService.read(CYPHER_GET_PREJUDICE_ANSWER, {
      id,
    });
    if (result.records.length !== 1) throw new Error('Prejudice.answer broken');

    return {
      id: result.records[0].get('id'),
      createdAt: new Date(result.records[0].get('createdAt')),
      correctness: result.records[0].get('correctness'),
      text: result.records[0].get('text'),
    };
  }
}
