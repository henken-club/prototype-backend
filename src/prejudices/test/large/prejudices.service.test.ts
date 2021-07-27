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

  describe('createPrejudice()', () => {
    it('return object if success with one relatedBook', async () => {
      await neo4jService.write(`
        CREATE (from:User {id: "from"})
        CREATE (to:User {id: "to"})
        CREATE (b:Book {id: "book1"})
        RETURN *
      `);
      const actual = await prejudicesService.createPrejudice('from', 'to', {
        title: 'title',
        relatedBooks: ['book1'],
      });
      expect(actual).toStrictEqual({
        id: expect.any(String),
        title: 'title',
        createdAt: expect.any(Date),
      });

      const count = await neo4jService
        .read(`MATCH (p:Prejudice) RETURN count(p) AS count`)
        .then((result) => result.records[0].get('count').toNumber());
      expect(count).toBe(1);

      const bookIds = await neo4jService
        .read(`MATCH (:Prejudice)-[:RELATED_BOOK]->(b:Book) RETURN b.id AS id`)
        .then((result) => result.records.map((record) => record.get('id')));
      expect(bookIds).toHaveLength(1);
      expect(bookIds).toContain('book1');
    });

    it('return object if success with multiple relatedBooks', async () => {
      await neo4jService.write(`
        CREATE (from:User {id: "from"})
        CREATE (to:User {id: "to"})
        CREATE (b1:Book {id: "book1"})
        CREATE (b2:Book {id: "book2"})
        RETURN *
      `);
      const actual = await prejudicesService.createPrejudice('from', 'to', {
        title: 'title',
        relatedBooks: ['book1', 'book2'],
      });
      expect(actual).toStrictEqual({
        id: expect.any(String),
        title: 'title',
        createdAt: expect.any(Date),
      });

      const count = await neo4jService
        .read(`MATCH (p:Prejudice) RETURN count(p) AS count`)
        .then((result) => result.records[0].get('count').toNumber());
      expect(count).toBe(1);

      const bookIds = await neo4jService
        .read(`MATCH (:Prejudice)-[:RELATED_BOOK]->(b:Book) RETURN b.id AS id`)
        .then((result) => result.records.map((record) => record.get('id')));
      expect(bookIds).toHaveLength(2);
      expect(bookIds).toContain('book1');
      expect(bookIds).toContain('book2');
    });

    it('return object if from user does not exist', async () => {
      await neo4jService.write(`
        CREATE (to:User {id: "to"})
        CREATE (b1:Book {id: "book1"})
        CREATE (b2:Book {id: "book2"})
        RETURN *
      `);
      const actual = await prejudicesService.createPrejudice('from', 'to', {
        title: 'title',
        relatedBooks: ['book1', 'book2'],
      });
      expect(actual).toStrictEqual({
        id: expect.any(String),
        title: 'title',
        createdAt: expect.any(Date),
      });

      const count = await neo4jService
        .read(`MATCH (p:Prejudice) RETURN count(p) AS count`)
        .then((result) => result.records[0].get('count').toNumber());
      expect(count).toBe(1);

      const bookIds = await neo4jService
        .read(`MATCH (:Prejudice)-[:RELATED_BOOK]->(b:Book) RETURN b.id AS id`)
        .then((result) => result.records.map((record) => record.get('id')));
      expect(bookIds).toHaveLength(2);
      expect(bookIds).toContain('book1');
      expect(bookIds).toContain('book2');
    });

    it('return object if to user does not exist', async () => {
      await neo4jService.write(`
        CREATE (from:User {id: "from"})
        CREATE (b1:Book {id: "book1"})
        CREATE (b2:Book {id: "book2"})
        RETURN *
      `);
      const actual = await prejudicesService.createPrejudice('from', 'to', {
        title: 'title',
        relatedBooks: ['book1', 'book2'],
      });
      expect(actual).toStrictEqual({
        id: expect.any(String),
        title: 'title',
        createdAt: expect.any(Date),
      });

      const count = await neo4jService
        .read(`MATCH (p:Prejudice) RETURN count(p) AS count`)
        .then((result) => result.records[0].get('count').toNumber());
      expect(count).toBe(1);

      const bookIds = await neo4jService
        .read(`MATCH (:Prejudice)-[:RELATED_BOOK]->(b:Book) RETURN b.id AS id`)
        .then((result) => result.records.map((record) => record.get('id')));
      expect(bookIds).toHaveLength(2);
      expect(bookIds).toContain('book1');
      expect(bookIds).toContain('book2');
    });
  });
});
