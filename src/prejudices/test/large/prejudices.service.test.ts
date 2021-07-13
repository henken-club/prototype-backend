import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';

import {Neo4jTestModule} from '~/neo4j/neo4j-test.module';
import {Neo4jService} from '~/neo4j/neo4j.service';
import {IdModule} from '~/id/id.module';
import {PrejudicesService} from '~/prejudices/prejudices.service';

describe('PrejudicesService', () => {
  let app: INestApplication;

  let neo4jService: Neo4jService;

  let prejudicesService: PrejudicesService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [Neo4jTestModule, IdModule],
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

  describe('addBook()', () => {
    it('return object if success', async () => {
      await neo4jService.write(`
        CREATE (from:User {id: "from"})
        CREATE (to:User {id: "to"})
        CREATE (b1:Book {id: "book1"})
        CREATE (b2:Book {id: "book2"})
        RETURN *
      `);
      const actual = await prejudicesService.createPrejudice({
        from: 'from',
        to: 'to',
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
