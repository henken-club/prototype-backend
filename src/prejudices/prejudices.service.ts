import {Injectable} from '@nestjs/common';
import {int, isDateTime, temporal} from 'neo4j-driver';

import {
  cypherGetPrejudice,
  cypherGetPrejudiceUserFrom,
  cypherGetPrejudiceUserTo,
} from './prejudices.cypher';
import {PrejudiceEntity} from './prejudices.entities';

import {Neo4jService} from '~/neo4j/neo4j.service';
import {IdService} from '~/id/id.service';
import {AuthorEntity, AuthorOrder} from '~/authors/authors.entities';
import {UserEntity} from '~/users/users.entities';

@Injectable()
export class PrejudicesService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly idService: IdService,
  ) {}

  async getById(id: string): Promise<PrejudiceEntity | null> {
    const result = await this.neo4jService.read(cypherGetPrejudice, {
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
    const result = await this.neo4jService.read(cypherGetPrejudiceUserFrom, {
      id,
    });
    if (result.records.length !== 1)
      throw new Error('Prejudice.userFrom broken');

    return {
      id: result.records[0].get('id'),
      alias: result.records[0].get('alias'),
      displayName: result.records[0].get('displayName'),
    };
  }

  async getUserTo(id: string): Promise<UserEntity> {
    const result = await this.neo4jService.read(cypherGetPrejudiceUserTo, {
      id,
    });
    if (result.records.length !== 1) throw new Error('Prejudice.userTo broken');

    return {
      id: result.records[0].get('id'),
      alias: result.records[0].get('alias'),
      displayName: result.records[0].get('displayName'),
    };
  }
}
