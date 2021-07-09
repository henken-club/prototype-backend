import {Injectable} from '@nestjs/common';
import {int} from 'neo4j-driver';

import {OrderDirection} from '../common/common.entities';

import {cypherAddBook} from './cypher/add-book.cypher';
import {cypherGetById} from './cypher/get-by-id.cypher';
import {BookEntity} from './books.entities';
import {
  cypherCountAuthors,
  cypherGetAuthorsOrderByNameAsc,
  cypherGetAuthorsOrderByNameDesc,
} from './cypher/get-authors';

import {Neo4jService} from '~/neo4j/neo4j.service';
import {IdService} from '~/id/id.service';
import {AuthorEntity, AuthorOrder} from '~/authors/authors.entities';

@Injectable()
export class BooksService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly idService: IdService,
  ) {}

  async getById(id: string): Promise<BookEntity | null> {
    const result = await this.neo4jService.read(cypherGetById, {id});
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

  getAuthorsQuery({direction, field}: AuthorOrder) {
    if (direction === OrderDirection.ASC) return cypherGetAuthorsOrderByNameAsc;
    else return cypherGetAuthorsOrderByNameDesc;
  }

  async getAuthors(
    id: string,
    {skip, limit, orderBy}: {skip: number; limit: number; orderBy: AuthorOrder},
  ): Promise<AuthorEntity[]> {
    const query = this.getAuthorsQuery(orderBy);
    const authors = await this.neo4jService
      .read(query, {id, skip: int(skip), limit: int(limit)})
      .then((result) =>
        result.records.map((record) => ({
          id: record.get('id'),
          name: record.get('name'),
        })),
      );
    return authors;
  }
}
