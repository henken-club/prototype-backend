import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {int} from 'neo4j-driver';
import {ClientGrpc} from '@nestjs/microservices';
import {map, Observable} from 'rxjs';

import {OrderDirection} from '../common/common.entities';

import {
  CYPHER_ADD_BOOK,
  CYPHER_GET_BOOK,
  CYPHER_GET_BOOK_AUTHORS_ORDER_BY_NAME_ASC,
  CYPHER_GET_BOOK_AUTHORS_ORDER_BY_NAME_DESC,
  CYPHER_GET_USER_RESPONSIBLE_FOR_BOOK,
  CYPHER_GET_ALL_BOOKS,
  CYPHER_GET_BOOK_AUTHORS_COUNT,
  CYPHER_COUNT_ALL_BOOKS,
} from './books.cypher';
import {BookEntity} from './books.entities';

import {Neo4jService} from '~/neo4j/neo4j.service';
import {IdService} from '~/id/id.service';
import {AuthorEntity, AuthorOrder} from '~/authors/authors.entities';
import {UserEntity} from '~/users/users.entities';
import {FetcherClient, FETCHER_SERVICE_NAME} from '~/protogen/bookcover';

@Injectable()
export class BooksService implements OnModuleInit {
  private bookcoverFetcher!: FetcherClient;

  constructor(
    @Inject('BookcoverClient')
    private readonly bookcoverClient: ClientGrpc,

    private readonly neo4jService: Neo4jService,
    private readonly idService: IdService,
  ) {}

  onModuleInit() {
    this.bookcoverFetcher =
      this.bookcoverClient.getService<FetcherClient>(FETCHER_SERVICE_NAME);
  }

  getBookcoverFromISBN(isbn: string): Observable<string | null> {
    return this.bookcoverFetcher
      .findFromISBN({isbn})
      .pipe(map(({url}) => url || null));
  }

  async getById(id: string): Promise<BookEntity | null> {
    const result = await this.neo4jService.read(CYPHER_GET_BOOK, {id});
    if (result.records.length !== 1) return null;
    return {
      id: result.records[0].get('id'),
      title: result.records[0].get('title'),
      isbn: result.records[0].get('isbn'),
    };
  }

  async getAll(): Promise<BookEntity[]> {
    return this.neo4jService.read(CYPHER_GET_ALL_BOOKS).then(({records}) =>
      records.map((record) => ({
        id: record.get('id'),
        title: record.get('title'),
        isbn: record.get('isbn'),
      })),
    );
  }

  async countAll(): Promise<number> {
    const result = await this.neo4jService.read(CYPHER_COUNT_ALL_BOOKS);
    if (result.records.length !== 1)
      throw new Error('something broken with neo4j');
    return result.records[0].get('count').toNumber();
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

  async countAuthors(id: string): Promise<number> {
    const result = await this.neo4jService.read(CYPHER_GET_BOOK_AUTHORS_COUNT, {
      id,
    });
    if (result.records.length !== 1)
      throw new Error('something broken with neo4j');
    return result.records[0].get('count').toNumber();
  }

  async addBook(
    userId: string,
    {
      title,
      authors,
      isbn,
    }: {title: string; authors: string[]; isbn: string | null},
  ): Promise<BookEntity | null> {
    const result = await this.neo4jService.write(CYPHER_ADD_BOOK, {
      userId,
      id: this.idService.createId(),
      title,
      authors,
      isbn,
    });
    if (result.records.length !== 1)
      throw new Error('something broken with neo4j');
    return {
      id: result.records[0].get('id'),
      title: result.records[0].get('title'),
      isbn: result.records[0].get('isbn'),
    };
  }
}
