import {Injectable} from '@nestjs/common';
import {int} from 'neo4j-driver';

import {
  CYPHER_ADD_AUTHOR,
  CYPHER_GET_AUTHOR,
  CYPHER_GET_AUTHOR_WRITED_BOOKS_ORDER_BY_TITLE_ASC,
  CYPHER_GET_AUTHOR_WRITED_BOOKS_ORDER_BY_TITLE_DESC,
} from './authors.cypher';

import {OrderDirection} from '~/common/common.entities';
import {Neo4jService} from '~/neo4j/neo4j.service';
import {AuthorEntity} from '~/authors/authors.entities';
import {BookEntity, BookOrder} from '~/books/books.entities';
import {IdService} from '~/id/id.service';

@Injectable()
export class AuthorsService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly idService: IdService,
  ) {}

  async getById(id: string): Promise<AuthorEntity | null> {
    const result = await this.neo4jService.read(CYPHER_GET_AUTHOR, {id});
    if (result.records.length !== 1) return null;
    return {
      id: result.records[0].get('id'),
      name: result.records[0].get('name'),
    };
  }

  getWritedBooksQuery({direction, field}: BookOrder) {
    if (direction === OrderDirection.ASC)
      return CYPHER_GET_AUTHOR_WRITED_BOOKS_ORDER_BY_TITLE_ASC;
    else return CYPHER_GET_AUTHOR_WRITED_BOOKS_ORDER_BY_TITLE_DESC;
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

  async addAuthor({
    name,
    userId,
  }: {
    name: string;
    userId: string;
  }): Promise<AuthorEntity | null> {
    const id = await this.idService.createId();
    const result = await this.neo4jService.write(CYPHER_ADD_AUTHOR, {
      id,
      name,
      userId,
    });
    if (result.records.length === 0) return null;
    return {
      id: result.records[0].get('id'),
      name: result.records[0].get('name'),
    };
  }
}
