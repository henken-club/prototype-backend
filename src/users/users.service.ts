import {Injectable} from '@nestjs/common';
import {int} from 'neo4j-driver';

import {UserEntity} from './users.entities';
import {cypherGetUserByAlias} from './cypher/get-by-alias.cypher';

import {Neo4jService} from '~/neo4j/neo4j.service';
import {IdService} from '~/id/id.service';
import {AuthorEntity, AuthorOrder} from '~/authors/authors.entities';

@Injectable()
export class UsersService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly idService: IdService,
  ) {}

  async getByAlias(alias: string): Promise<UserEntity | null> {
    const result = await this.neo4jService.read(cypherGetUserByAlias, {alias});
    if (result.records.length !== 1) return null;
    return {
      id: result.records[0].get('id'),
      alias: result.records[0].get('alias'),
      displayName: result.records[0].get('displayName'),
    };
  }
}
