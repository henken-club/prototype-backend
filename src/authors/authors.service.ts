import {Injectable} from '@nestjs/common';
import {int} from 'neo4j-driver';

import {cypherGetById} from './cypher/get-by-id.cypher';
import {
  cypherGetWritedBooksOrderByNameAsc,
  cypherGetWritedBooksOrderByNameDesc,
} from './cypher/get-writed-books';

import {OrderDirection} from '~/common/common.entities';
import {Neo4jService} from '~/neo4j/neo4j.service';
import {AuthorEntity} from '~/authors/authors.entities';
import {BookEntity, BookOrder} from '~/books/books.entities';

@Injectable()
export class AuthorsService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async getById(id: string): Promise<AuthorEntity | null> {
    const result = await this.neo4jService.read(cypherGetById, {id});
    if (result.records.length !== 1) return null;
    return {
      id: result.records[0].get('id'),
      name: result.records[0].get('name'),
    };
  }

  getWritedBooksQuery({direction, field}: BookOrder) {
    if (direction === OrderDirection.ASC)
      return cypherGetWritedBooksOrderByNameAsc;
    else return cypherGetWritedBooksOrderByNameDesc;
  }

  async getWritedBooks(
    id: string,
    {skip, limit, orderBy}: {skip: number; limit: number; orderBy: BookOrder},
  ): Promise<BookEntity[]> {
    const query = this.getWritedBooksQuery(orderBy);
    const books = await this.neo4jService
      .read(query, {id, skip: int(skip), limit: int(limit)})
      .then((result) =>
        result.records.map((record) => ({
          id: record.get('id'),
          title: record.get('title'),
        })),
      );
    return books;
  }
}
