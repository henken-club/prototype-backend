import {Injectable} from '@nestjs/common';
import {int} from 'neo4j-driver';

import {
  CYPHER_GET_PREJUDICE_BY_ID,
  CYPHER_GET_PREJUDICE_RELATED_BOOKS_ORDERBY_TITLE_AT_ASC,
  CYPHER_GET_PREJUDICE_RELATED_BOOKS_ORDERBY_TITLE_AT_DESC,
  CYPHER_RESOLVE_PREJUDICE_ANSWER,
  CYPHER_RESOLVE_PREJUDICE_USER_POSTED,
  CYPHER_RESOLVE_PREJUDICE_USER_RECEIVED,
  CYPHER_GET_ALL_PREJUDICES,
  CYPHER_GET_PREJUDICE_BY_USER_ID_AND_NUMBER,
  CYPHER_CREATE_PREJUDICE,
  CYPHER_RESOLVE_PREJUDICE_TITLE,
  CYPHER_RESOLVE_PREJUDICE_CREATED_AT,
  CYPHER_RESOLVE_PREJUDICE_NUMBER,
} from './prejudices.cypher';
import {PrejudiceEntity} from './prejudices.entities';

import {Neo4jService} from '~/neo4j/neo4j.service';
import {AnswerEntity} from '~/answers/answers.entities';
import {BookEntity, BookOrder} from '~/books/books.entities';
import {OrderDirection} from '~/users/dto/OrderDirection';

@Injectable()
export class PrejudicesService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async resolveTitle(id: string): Promise<string> {
    return this.neo4jService
      .read(CYPHER_RESOLVE_PREJUDICE_TITLE, {id})
      .then(({records}) => records[0].get('title'));
  }

  async resolveCreatedAt(id: string): Promise<Date> {
    return this.neo4jService
      .read(CYPHER_RESOLVE_PREJUDICE_CREATED_AT, {id})
      .then(({records}) => new Date(records[0].get('createdAt').toNumber()));
  }

  async resolveNumber(id: string): Promise<Date> {
    return this.neo4jService
      .read(CYPHER_RESOLVE_PREJUDICE_NUMBER, {id})
      .then(({records}) => records[0].get('number').toNumber());
  }

  async resolveUserPosted(id: string): Promise<string | null> {
    const result = await this.neo4jService.read(
      CYPHER_RESOLVE_PREJUDICE_USER_POSTED,
      {id},
    );
    if (result.records.length !== 1) return null;
    return result.records[0].get('id');
  }

  async resolveUserReceived(id: string): Promise<string | null> {
    const result = await this.neo4jService.read(
      CYPHER_RESOLVE_PREJUDICE_USER_RECEIVED,
      {
        id,
      },
    );
    if (result.records.length !== 1) return null;
    return result.records[0].get('id');
  }

  async resolveAnswer(id: string): Promise<AnswerEntity | null> {
    const result = await this.neo4jService.read(
      CYPHER_RESOLVE_PREJUDICE_ANSWER,
      {id},
    );
    if (result.records.length !== 1) return null;
    return {id: result.records[0].get('id')};
  }

  getQueryForResolveRelatedBooks({direction, field}: BookOrder) {
    if (direction === OrderDirection.ASC)
      return CYPHER_GET_PREJUDICE_RELATED_BOOKS_ORDERBY_TITLE_AT_ASC;
    else return CYPHER_GET_PREJUDICE_RELATED_BOOKS_ORDERBY_TITLE_AT_DESC;
  }

  async resolveRelatedBooks(
    id: string,
    {skip, limit, orderBy}: {skip: number; limit: number; orderBy: BookOrder},
  ): Promise<BookEntity[]> {
    const query = this.getQueryForResolveRelatedBooks(orderBy);
    return this.neo4jService
      .read(query, {id, skip: int(skip), limit: int(limit)})
      .then((result) =>
        result.records.map((record) => ({
          id: record.get('id'),
          title: record.get('title'),
        })),
      );
  }

  async getById(id: string): Promise<PrejudiceEntity | null> {
    const result = await this.neo4jService.read(CYPHER_GET_PREJUDICE_BY_ID, {
      id,
    });
    if (result.records.length !== 1) return null;

    return {id: result.records[0].get('id')};
  }

  async getByUserIdAndNumber(
    posted: string,
    receivedId: string,
    number: number,
  ): Promise<PrejudiceEntity | null> {
    const result = await this.neo4jService.read(
      CYPHER_GET_PREJUDICE_BY_USER_ID_AND_NUMBER,
      {posted, received: receivedId, number},
    );
    if (result.records.length !== 1) return null;

    return {id: result.records[0].get('id')};
  }

  async getAllPrejudices(): Promise<PrejudiceEntity[]> {
    return this.neo4jService.read(CYPHER_GET_ALL_PREJUDICES).then(({records}) =>
      records.map((record) => ({
        id: record.get('id'),
        title: record.get('title'),
        createdAt: new Date(record.get('createdAt')),
      })),
    );
  }

  async createPrejudice(
    posted: string,
    received: string,
    {title, relatedBooks}: {title: string; relatedBooks: string[]},
  ): Promise<{id: string}> {
    const result = await this.neo4jService.write(CYPHER_CREATE_PREJUDICE, {
      posted,
      received,
      title,
      relatedBooks,
    });
    if (result.records.length !== 1) throw new Error();
    return {id: result.records[0].get('id')};
  }
}
