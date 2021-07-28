import {Injectable} from '@nestjs/common';

import {
  CYPHER_GET_ANSWER,
  CYPHER_GET_ALL_ANSWERS,
  CYPHER_GET_ANSWER_TO_PREJUDICE,
} from './answers.cypher';
import {AnswerEntity} from './answers.entities';

import {Neo4jService} from '~/neo4j/neo4j.service';
import {IdService} from '~/id/id.service';
import {PrejudiceEntity} from '~/prejudices/prejudices.entities';

@Injectable()
export class AnswersService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly idService: IdService,
  ) {}

  async getById(id: string): Promise<AnswerEntity | null> {
    const result = await this.neo4jService.read(CYPHER_GET_ANSWER, {
      id,
    });
    if (result.records.length !== 1) return null;

    return {
      id: result.records[0].get('id'),
      createdAt: new Date(result.records[0].get('createdAt')),
      correctness: result.records[0].get('correctness'),
      text: result.records[0].get('text'),
    };
  }

  async getAll(): Promise<AnswerEntity[]> {
    return this.neo4jService.read(CYPHER_GET_ALL_ANSWERS).then(({records}) =>
      records.map((record) => ({
        id: record.get('id'),
        correctness: record.get('correctness'),
        text: record.get('text'),
        createdAt: new Date(record.get('createdAt')),
      })),
    );
  }

  async getPrejudice(id: string): Promise<PrejudiceEntity> {
    const result = await this.neo4jService.read(
      CYPHER_GET_ANSWER_TO_PREJUDICE,
      {
        id,
      },
    );
    if (result.records.length !== 1)
      throw new Error('Prejudice.userFrom broken');

    return {
      id: result.records[0].get('id'),
      title: result.records[0].get('title'),
      createdAt: new Date(result.records[0].get('createdAt')),
    };
  }
}
