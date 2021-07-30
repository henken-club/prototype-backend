import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';

import {Neo4jService} from '~/neo4j/neo4j.service';
import {BooksService} from '~/books/books.service';
import {IdModule} from '~/id/id.module';
import {Neo4jModule} from '~/neo4j/neo4j.module';

describe('BooksService', () => {
  let app: INestApplication;

  let neo4jService: Neo4jService;

  let booksService: BooksService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [Neo4jModule, IdModule],
      providers: [BooksService],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    neo4jService = module.get<Neo4jService>(Neo4jService);
    booksService = module.get<BooksService>(BooksService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await neo4jService.write(`MATCH (n) DETACH DELETE n`);
  });

  afterAll(async () => {
    await app.close();
  });

  it('to be defined', () => {
    expect(booksService).toBeDefined();
  });

  describe('findById()', () => {
    it('return null if id does not exist', async () => {
      const actual = await booksService.getById('1');
      expect(actual).toBeNull();
    });

    it('return object if id exists', async () => {
      await neo4jService.write(
        `CREATE (b:Book {id: "1", title: "Title"}) RETURN *`,
      );

      const actual = await booksService.getById('1');

      expect(actual).toStrictEqual({
        id: '1',
        title: 'Title',
      });
    });
  });

  describe('addBook()', () => {
    it('return object if user exist in neo4j', async () => {
      await neo4jService.write(
        `
        CREATE (u:User {id: "user1"})
        CREATE (a1:Author {id: "author1"}), (a2:Author {id: "author2"})
        RETURN *
        `,
      );

      const actual = await booksService.addBook({
        title: 'Title',
        userId: 'user1',
        authors: ['author1', 'author2'],
      });

      expect(actual).toStrictEqual({
        id: expect.any(String),
        title: 'Title',
      });

      const bookCount = await neo4jService
        .read(`MATCH (b:Book) RETURN count(b) AS count`)
        .then((result) => result.records[0].get('count').toNumber());
      expect(bookCount).toBe(1);

      const userCount = await neo4jService
        .read(`MATCH (u:User) RETURN count(u) AS count`)
        .then((result) => result.records[0].get('count').toNumber());
      expect(userCount).toBe(1);

      const responsibleCount = await neo4jService
        .read(
          `MATCH (:User)-[r:RESPONSIBLE_FOR]->(:Book) RETURN count(r) AS count`,
        )
        .then((result) => result.records[0].get('count').toNumber());
      expect(responsibleCount).toBe(1);

      const writesBookCount = await neo4jService
        .read(
          `MATCH (:Author)-[r:WRITES_BOOK]->(:Book) RETURN count(r) AS count`,
        )
        .then((result) => result.records[0].get('count').toNumber());
      expect(writesBookCount).toBe(2);
    });

    it('return object if user does not exist in neo4j', async () => {
      await neo4jService.write(
        `CREATE (a1:Author {id: "author1"}), (a2:Author {id: "author2"}) RETURN *`,
      );

      const actual = await booksService.addBook({
        title: 'Title',
        userId: '1',
        authors: ['author1', 'author2'],
      });
      expect(actual).toStrictEqual({
        id: expect.any(String),
        title: 'Title',
      });

      const bookCount = await neo4jService
        .read(`MATCH (b:Book) RETURN count(b) AS count`)
        .then((result) => result.records[0].get('count').toNumber());
      expect(bookCount).toBe(1);

      const userCount = await neo4jService
        .read(`MATCH (u:User) RETURN count(u) AS count`)
        .then((result) => result.records[0].get('count').toNumber());
      expect(userCount).toBe(1);

      const responsibleCount = await neo4jService
        .read(
          `MATCH (:User)-[r:RESPONSIBLE_FOR]->(:Book) RETURN count(r) AS count`,
        )
        .then((result) => result.records[0].get('count').toNumber());
      expect(responsibleCount).toBe(1);

      const writesBookCount = await neo4jService
        .read(
          `MATCH (:Author)-[r:WRITES_BOOK]->(:Book) RETURN count(r) AS count`,
        )
        .then((result) => result.records[0].get('count').toNumber());
      expect(writesBookCount).toBe(2);
    });
  });

  describe('getUserResponsibleFor', () => {
    it('return array if success', async () => {
      await neo4jService.write(
        `
        CREATE (b:Book {id: "book1"}), (u1:User {id: "user1"}), (u2:User {id: "user2"})
        CREATE (u1)-[:RESPONSIBLE_FOR {updatedAt: localdatetime({year: 2021})}]->(b)
        CREATE (u2)-[:RESPONSIBLE_FOR {updatedAt: localdatetime({year: 2020})}]->(b)
        RETURN *
        `,
      );

      const actual = await booksService.getUserResponsibleFor('book1');
      expect(actual).toStrictEqual([{id: 'user1'}, {id: 'user2'}]);
    });

    it('return empty array if author does not exist', async () => {
      const actual = await booksService.getUserResponsibleFor('author1');
      expect(actual).toStrictEqual([]);
    });
  });
});
