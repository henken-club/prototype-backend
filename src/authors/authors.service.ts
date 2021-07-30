import {Injectable} from '@nestjs/common';
import {int} from 'neo4j-driver';

import {
  CYPHER_ADD_AUTHOR,
  CYPHER_GET_AUTHOR,
  CYPHER_GET_AUTHOR_WRITES_BOOKS_ORDER_BY_TITLE_ASC,
  CYPHER_GET_AUTHOR_WRITES_BOOKS_ORDER_BY_TITLE_DESC,
  CYPHER_GET_USER_RESPONSIBLE_FOR_AUTHOR,
  CYPHER_GET_ALL_AUTHORS,
} from './authors.cypher';

import {OrderDirection} from '~/common/common.entities';
import {Neo4jService} from '~/neo4j/neo4j.service';
import {AuthorEntity} from '~/authors/authors.entities';
import {BookEntity, BookOrder} from '~/books/books.entities';
import {IdService} from '~/id/id.service';
import {UserEntity} from '~/users/users.entities';

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

  async getUserResponsibleFor(id: string): Promise<UserEntity[]> {
    return this.neo4jService
      .read(CYPHER_GET_USER_RESPONSIBLE_FOR_AUTHOR, {id})
      .then((result) =>
        result.records.map((record) => ({
          id: record.get('id'),
        })),
      );
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
