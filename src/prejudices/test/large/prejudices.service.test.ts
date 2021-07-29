import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';

import {Neo4jService} from '~/neo4j/neo4j.service';
import {IdModule} from '~/id/id.module';
import {PrejudicesService} from '~/prejudices/prejudices.service';
import {UsersModule} from '~/users/users.module';
import {Neo4jModule} from '~/neo4j/neo4j.module';

describe('PrejudicesService', () => {
  let app: INestApplication;

  let neo4jService: Neo4jService;

  let prejudicesService: PrejudicesService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [Neo4jModule, IdModule, UsersModule],
      providers: [PrejudicesService],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    neo4jService = module.get<Neo4jService>(Neo4jService);
    prejudicesService = module.get<PrejudicesService>(PrejudicesService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await neo4jService.write(`MATCH (n) DETACH DELETE n`);
  });

  afterAll(async () => {
    await app.close();
  });

  it('to be defined', () => {
    expect(prejudicesService).toBeDefined();
  });

  describe('createPrejudice', () => {
    describe('first create', () => {
      beforeEach(async () => {
        await neo4jService.write(`
          CREATE (p:User {id: "post"})
          CREATE (r:User {id: "recieved"})
          CREATE (b1:Book {id: "book1"})
          CREATE (b2:Book {id: "book2"})
          RETURN *
        `);
      });

      it('with single book', async () => {
        const actual = await prejudicesService.createPrejudice(
          'post',
          'recieved',
          {
            title: 'title',
            relatedBooks: ['book1'],
          },
        );

        expect(actual).toStrictEqual({id: expect.any(String)});

        expect(
          await neo4jService
            .read(
              `
          MATCH (p:Prejudice {id: $id})
          RETURN p.id AS id, p.title AS title, p.number AS number
          `,
              {id: actual.id},
            )
            .then((result) => ({
              id: result.records[0].get('id'),
              title: result.records[0].get('title'),
              number: result.records[0].get('number').toNumber(),
            })),
        ).toStrictEqual({
          id: actual.id,
          title: 'title',
          number: 1,
        });
        expect(
          await neo4jService
            .read(
              `MATCH (:User {id: "post"})-[r:POST_PREJUDICE]->(:Prejudice {id: $id}) RETURN count(r) = 1 AS result`,
              {id: actual.id},
            )
            .then((result) => result.records[0].get('result')),
        ).toBe(true);
        expect(
          await neo4jService
            .read(
              `MATCH (:Prejudice {id: $id})-[r:PREJUDICE_AGAINST]->(:User {id: "recieved"}) RETURN count(r) = 1 AS result`,
              {id: actual.id},
            )
            .then((result) => result.records[0].get('result')),
        ).toBe(true);
        expect(
          await neo4jService
            .read(
              `MATCH (:Prejudice {id: $id})-[r:RELATED_BOOK]->(:Book {id: "book1"}) RETURN count(r) = 1 AS result`,
              {id: actual.id},
            )
            .then((result) => result.records[0].get('result')),
        ).toBe(true);
      });

      it('with multiple books', async () => {
        const actual = await prejudicesService.createPrejudice(
          'post',
          'recieved',
          {
            title: 'title',
            relatedBooks: ['book1', 'book2'],
          },
        );

        expect(actual).toStrictEqual({id: expect.any(String)});

        expect(
          await neo4jService
            .read(
              `
          MATCH (p:Prejudice {id: $id})
          RETURN p.id AS id, p.title AS title, p.number AS number
          `,
              {id: actual.id},
            )
            .then((result) => ({
              id: result.records[0].get('id'),
              title: result.records[0].get('title'),
              number: result.records[0].get('number').toNumber(),
            })),
        ).toStrictEqual({
          id: actual.id,
          title: 'title',
          number: 1,
        });
        expect(
          await neo4jService
            .read(
              `MATCH (:User {id: "post"})-[r:POST_PREJUDICE]->(:Prejudice {id: $id}) RETURN count(r) = 1 AS result`,
              {id: actual.id},
            )
            .then((result) => result.records[0].get('result')),
        ).toBe(true);
        expect(
          await neo4jService
            .read(
              `MATCH (:Prejudice {id: $id})-[r:PREJUDICE_AGAINST]->(:User {id: "recieved"}) RETURN count(r) = 1 AS result`,
              {id: actual.id},
            )
            .then((result) => result.records[0].get('result')),
        ).toBe(true);
        expect(
          await neo4jService
            .read(
              `MATCH (:Prejudice {id: $id})-[r:RELATED_BOOK]->(:Book {id: "book1"}) RETURN count(r) = 1 AS result`,
              {id: actual.id},
            )
            .then((result) => result.records[0].get('result')),
        ).toBe(true);
        expect(
          await neo4jService
            .read(
              `MATCH (:Prejudice {id: $id})-[r:RELATED_BOOK]->(:Book {id: "book2"}) RETURN count(r) = 1 AS result`,
              {id: actual.id},
            )
            .then((result) => result.records[0].get('result')),
        ).toBe(true);
      });
    });

    describe('second create', () => {
      beforeEach(async () => {
        await neo4jService.write(`
          CREATE (pu:User {id: "post"})
          CREATE (ru:User {id: "recieved"})
          CREATE (b1:Book {id: "book1"})
          CREATE (b2:Book {id: "book2"})
          CREATE (pu)-[:POST_PREJUDICE]->(p:Prejudice)-[:PREJUDICE_AGAINST]->(ru)
          CREATE (p)-[:RELATED_BOOK]->(b1)
          RETURN *
        `);
      });

      it('with single book', async () => {
        const actual = await prejudicesService.createPrejudice(
          'post',
          'recieved',
          {
            title: 'title',
            relatedBooks: ['book1'],
          },
        );

        expect(actual).toStrictEqual({id: expect.any(String)});

        expect(
          await neo4jService
            .read(
              `
          MATCH (p:Prejudice {id: $id})
          RETURN p.id AS id, p.title AS title, p.number AS number
          `,
              {id: actual.id},
            )
            .then((result) => ({
              id: result.records[0].get('id'),
              title: result.records[0].get('title'),
              number: result.records[0].get('number').toNumber(),
            })),
        ).toStrictEqual({
          id: actual.id,
          title: 'title',
          number: 2,
        });
        expect(
          await neo4jService
            .read(
              `MATCH (:User {id: "post"})-[r:POST_PREJUDICE]->(:Prejudice {id: $id}) RETURN count(r) = 1 AS result`,
              {id: actual.id},
            )
            .then((result) => result.records[0].get('result')),
        ).toBe(true);
        expect(
          await neo4jService
            .read(
              `MATCH (:Prejudice {id: $id})-[r:PREJUDICE_AGAINST]->(:User {id: "recieved"}) RETURN count(r) = 1 AS result`,
              {id: actual.id},
            )
            .then((result) => result.records[0].get('result')),
        ).toBe(true);
        expect(
          await neo4jService
            .read(
              `MATCH (:Prejudice {id: $id})-[r:RELATED_BOOK]->(:Book {id: "book1"}) RETURN count(r) = 1 AS result`,
              {id: actual.id},
            )
            .then((result) => result.records[0].get('result')),
        ).toBe(true);
      });
    });
  });
});
