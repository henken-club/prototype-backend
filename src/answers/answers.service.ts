import {Injectable} from '@nestjs/common';

import {
  CYPHER_GET_ANSWER_BY_ID,
  CYPHER_GET_ALL_ANSWERS,
  CYPHER_RESOLVE_ANSWER_PREJUDICE,
  CYPHER_GET_ANSWER_BY_USER_ID_AND_NUMBER,
  CYPHER_RESOLVE_ANSWER_TEXT,
  CYPHER_RESOLVE_ANSWER_CREATED_AT,
  CYPHER_RESOLVE_ANSWER_CORRECTNESS,
} from './answers.cypher';
import {AnswerEntity, Correctness} from './answers.entities';

import {Neo4jService} from '~/neo4j/neo4j.service';
import {PrejudiceEntity} from '~/prejudices/prejudices.entities';

@Injectable()
export class AnswersService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async resolveCorrectness(id: string): Promise<Correctness> {
    return this.neo4jService
      .read(CYPHER_RESOLVE_ANSWER_CORRECTNESS, {id})
      .then(({records}) => records[0].get('correctness'));
  }

  async resolveText(id: string): Promise<string> {
    return this.neo4jService
      .read(CYPHER_RESOLVE_ANSWER_TEXT, {id})
      .then(({records}) => records[0].get('text'));
  }

  async resolveCreatedAt(id: string): Promise<Date> {
    return this.neo4jService
      .read(CYPHER_RESOLVE_ANSWER_CREATED_AT, {id})
      .then(({records}) => new Date(records[0].get('createdAt').toNumber()));
  }

  async resolvePrejudice(id: string): Promise<PrejudiceEntity> {
    return this.neo4jService
      .read(CYPHER_RESOLVE_ANSWER_PREJUDICE, {id})
      .then(({records}) => ({id: records[0].get('id')}));
  }

  async getById(id: string): Promise<AnswerEntity | null> {
    const result = await this.neo4jService.read(CYPHER_GET_ANSWER_BY_ID, {
      id,
    });
    if (result.records.length !== 1) return null;
    return {id: result.records[0].get('id')};
  }

  async getByUserIdAndNumber(
    postId: string,
    receivedId: string,
    number: number,
  ): Promise<PrejudiceEntity | null> {
    const result = await this.neo4jService.read(
      CYPHER_GET_ANSWER_BY_USER_ID_AND_NUMBER,
      {post: postId, received: receivedId, number},
    );
    if (result.records.length !== 1) return null;
    return {id: result.records[0].get('id')};
  }

  async getAll(): Promise<AnswerEntity[]> {
    return this.neo4jService
      .read(CYPHER_GET_ALL_ANSWERS)
      .then(({records}) => records.map((record) => ({id: record.get('id')})));
  }
}
