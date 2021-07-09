import {Injectable} from '@nestjs/common';

import {cypherAddBook, cypherGetBookById} from './books.cypher';
import {BookEntity} from './books.entities';

import {Neo4jService} from '~/neo4j/neo4j.service';
import {IdService} from '~/id/id.service';

@Injectable()
export class BooksService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly idService: IdService,
  ) {}

  async getById(id: string): Promise<BookEntity | null> {
    const result = await this.neo4jService.read(cypherGetBookById, {id});
    if (result.records.length !== 1) return null;
    return {
      id: result.records[0].get('id'),
      title: result.records[0].get('title'),
    };
  }

  async addBook({title}: {title: string}): Promise<BookEntity> {
    const id = this.idService.createId();

    const result = await this.neo4jService.write(cypherAddBook, {id, title});
    if (result.records.length === 0) throw new Error('Failed add book');
    return {
      id: result.records[0].get('id'),
      title: result.records[0].get('title'),
    };
  }
}
