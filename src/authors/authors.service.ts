import {Injectable} from '@nestjs/common';
import {int} from 'neo4j-driver';

import {
  CYPHER_ADD_AUTHOR,
  CYPHER_GET_AUTHOR,
  CYPHER_GET_AUTHOR_WRITES_BOOKS_ORDER_BY_TITLE_ASC,
  CYPHER_GET_AUTHOR_WRITES_BOOKS_ORDER_BY_TITLE_DESC,
  CYPHER_GET_USER_RESPONSIBLE_FOR_AUTHOR,
  CYPHER_GET_ALL_AUTHORS,
  CYPHER_SEARCH_AUTHORS,
  CYPHER_COUNT_SEARCH_AUTHORS,
  CYPHER_COUNT_ALL_AUTHORS,
  CYPHER_COUNT_AUTHOR_WRITES_BOOKS,
} from './authors.cypher';

import {Neo4jService} from '~/neo4j/neo4j.service';
import {AuthorEntity} from '~/authors/authors.entities';
import {BookEntity, BookOrder} from '~/books/books.entities';
import {IdService} from '~/id/id.service';
import {UserEntity} from '~/users/users.entities';
import {OrderDirection} from '~/common/common.entities';

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

  async getAll(): Promise<AuthorEntity[]> {
    return this.neo4jService.read(CYPHER_GET_ALL_AUTHORS).then(({records}) =>
      records.map((record) => ({
        id: record.get('id'),
        name: record.get('name'),
      })),
    );
  }

  async countAll(): Promise<number> {
    const result = await this.neo4jService.read(CYPHER_COUNT_ALL_AUTHORS);
    if (result.records.length !== 1)
      throw new Error('something broken with neo4j');
    return result.records[0].get('count').toNumber();
  }

  async checkExistence(idArray: string[]): Promise<boolean> {
    return !(await Promise.all(idArray.map((id) => this.getById(id)))).includes(
      null,
    );
  }

  getWritesBooksQuery({direction, field}: BookOrder) {
    if (direction === OrderDirection.ASC)
      return CYPHER_GET_AUTHOR_WRITES_BOOKS_ORDER_BY_TITLE_ASC;
    else return CYPHER_GET_AUTHOR_WRITES_BOOKS_ORDER_BY_TITLE_DESC;
  }

  async getWritesBooks(
    id: string,
    {skip, limit, orderBy}: {skip: number; limit: number; orderBy: BookOrder},
  ): Promise<BookEntity[]> {
    const query = this.getWritesBooksQuery(orderBy);
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

  async countWritesBooks(id: string) {
    const result = await this.neo4jService.read(
      CYPHER_COUNT_AUTHOR_WRITES_BOOKS,
      {id},
    );
    if (result.records.length !== 1)
      throw new Error('something broken with neo4j');
    return result.records[0].get('count').toNumber();
  }

  async getUserResponsibleFor(id: string): Promise<UserEntity[]> {
    return this.neo4jService
      .read(CYPHER_GET_USER_RESPONSIBLE_FOR_AUTHOR, {id})
      .then((result) =>
        result.records.map((record) => ({
          id: record.get('id'),
        })),
      );
  }

  async addAuthor(
    userId: string,
    {name}: {name: string},
  ): Promise<AuthorEntity | null> {
    const result = await this.neo4jService.write(CYPHER_ADD_AUTHOR, {
      userId,
      id: this.idService.createId(),
      name,
    });

    if (result.records.length !== 1)
      throw new Error('something broken with neo4j');

    return {
      id: result.records[0].get('id'),
      name: result.records[0].get('name'),
    };
  }

  async getSearchAuthorsQuery() {}

  async searchAuthors(
    query: string,
    {skip, limit}: {skip: number; limit: number},
  ): Promise<AuthorEntity[]> {
    return this.neo4jService
      .read(CYPHER_SEARCH_AUTHORS, {
        query,
        skip: int(skip),
        limit: int(limit),
      })
      .then(({records}) =>
        records.map((record) => ({
          id: record.get('id'),
          name: record.get('name'),
        })),
      );
  }

  async countSearchAuthors(query: string): Promise<number> {
    const result = await this.neo4jService.write(CYPHER_COUNT_SEARCH_AUTHORS, {
      query,
    });

    if (result.records.length !== 1)
      throw new Error('something broken with neo4j');

    return result.records[0].get('count').toNumber();
  }
}
