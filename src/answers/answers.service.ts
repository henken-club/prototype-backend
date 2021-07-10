import {Injectable} from '@nestjs/common';
import {int, isDateTime, temporal} from 'neo4j-driver';

import {cypherGetAnswer, cypherGetAnswerToPrejudice} from './answers.cypher';
import {AnswerEntity} from './answers.entities';

import {Neo4jService} from '~/neo4j/neo4j.service';
import {IdService} from '~/id/id.service';
import {AuthorEntity, AuthorOrder} from '~/authors/authors.entities';
import {UserEntity} from '~/users/users.entities';
import {PrejudiceEntity} from '~/prejudices/prejudices.entities';

@Injectable()
export class AnswersService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly idService: IdService,
  ) {}

  async getById(id: string): Promise<AnswerEntity | null> {
    const result = await this.neo4jService.read(cypherGetAnswer, {
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

  async getPrejudice(id: string): Promise<PrejudiceEntity> {
    const result = await this.neo4jService.read(cypherGetAnswerToPrejudice, {
      id,
    });
    if (result.records.length !== 1)
      throw new Error('Prejudice.userFrom broken');

    return {
      id: result.records[0].get('id'),
      title: result.records[0].get('title'),
      createdAt: new Date(result.records[0].get('createdAt')),
    };
  }
}
