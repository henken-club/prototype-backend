import {Injectable} from '@nestjs/common';

import {Neo4jService} from '../neo4j/neo4j.service';

import {cypherGetBookById} from './books.cypher';
import {BookEntity} from './books.entities';

@Injectable()
export class BooksService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async getById(id: string): Promise<BookEntity | null> {
    const result = await this.neo4jService.read(cypherGetBookById, {id});
    if (result.records.length !== 1) return null;
    return {
      id: result.records[0].get('id'),
      title: result.records[0].get('title'),
    };
  }
}
