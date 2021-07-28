import {Injectable} from '@nestjs/common';
import {int} from 'neo4j-driver';

import {OrderDirection} from '../common/common.entities';

import {
  CYPHER_ADD_BOOK,
  CYPHER_GET_BOOK,
  CYPHER_GET_BOOK_AUTHORS_ORDER_BY_NAME_ASC,
  CYPHER_GET_BOOK_AUTHORS_ORDER_BY_NAME_DESC,
  CYPHER_GET_USER_RESPONSIBLE_FOR_BOOK,
  CYPHER_GET_ALL_BOOKS,
} from './books.cypher';
import {BookEntity} from './books.entities';

import {Neo4jService} from '~/neo4j/neo4j.service';
import {IdService} from '~/id/id.service';
import {AuthorEntity, AuthorOrder} from '~/authors/authors.entities';
import {UserEntity} from '~/users/users.entities';

@Injectable()
export class BooksService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly idService: IdService,
  ) {}

  async getById(id: string): Promise<BookEntity | null> {
    const result = await this.neo4jService.read(CYPHER_GET_BOOK, {id});
    if (result.records.length !== 1) return null;
    return {
      id: result.records[0].get('id'),
      title: result.records[0].get('title'),
    };
  }

  async getAll(): Promise<BookEntity[]> {
    return this.neo4jService.read(CYPHER_GET_ALL_BOOKS).then(({records}) =>
      records.map((record) => ({
        id: record.get('id'),
        title: record.get('title'),
      })),
    );
  }

  async addBook({
    title,
    userId,
    authors,
  }: {
    userId: string;
    title: string;
    authors: string[];
  }): Promise<BookEntity | null> {
    const id = this.idService.createId();

    const result = await this.neo4jService.write(CYPHER_ADD_BOOK, {
      id,
      title,
      userId,
      authors,
    });
    if (result.records.length !== 1) return null;
    return {
      id: result.records[0].get('id'),
      title: result.records[0].get('title'),
    };
  }

  getAuthorsQuery({direction, field}: AuthorOrder) {
    if (direction === OrderDirection.ASC)
      return CYPHER_GET_BOOK_AUTHORS_ORDER_BY_NAME_ASC;
    else return CYPHER_GET_BOOK_AUTHORS_ORDER_BY_NAME_DESC;
  }

  async getUserResponsibleFor(id: string): Promise<UserEntity[]> {
    return this.neo4jService
      .read(CYPHER_GET_USER_RESPONSIBLE_FOR_BOOK, {id})
      .then((result) =>
        result.records.map((record) => ({
          id: record.get('id'),
        })),
      );
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
