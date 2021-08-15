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
        `CREATE (b:Book {id: "1", title: "Title", isbn: "9784845860203"}) RETURN *`,
      );

      const actual = await booksService.getById('1');

      expect(actual).toStrictEqual({
        id: '1',
        title: 'Title',
        isbn: '9784845860203',
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

      const actual = await booksService.addBook('user1', {
        title: 'Title',
        authors: ['author1', 'author2'],
        isbn: '9784845860203',
      });
      expect(actual).toStrictEqual({
        id: expect.any(String),
        title: 'Title',
        isbn: '9784845860203',
      });

      expect(
        await neo4jService
          .read(`MATCH (b:Book {id: $id}) RETURN count(b) AS count`, {
            id: actual?.id,
          })
          .then((result) => result.records[0].get('count').toNumber()),
      ).toBe(1);

      expect(
        await neo4jService
          .read(`MATCH (u:User {id: "user1"}) RETURN count(u) AS count`)
          .then((result) => result.records[0].get('count').toNumber()),
      ).toBe(1);

      expect(
        await neo4jService
          .read(
            `RETURN exists((:User {id: "user1"})-[:RESPONSIBLE_FOR]->(:Book {id: $id})) AS exists`,
            {id: actual?.id},
          )
          .then((result) => result.records[0].get('exists')),
      ).toBe(true);

      expect(
        await neo4jService
          .read(
            `RETURN exists((:Author {id: "author1"})-[:WRITES_BOOK]->(:Book {id: $id})) AS exists`,
            {id: actual?.id},
          )
          .then((result) => result.records[0].get('exists')),
      ).toBe(true);

      expect(
        await neo4jService
          .read(
            `RETURN exists((:Author {id: "author1"})-[:WRITES_BOOK]->(:Book {id: $id})) AS exists`,
            {id: actual?.id},
          )
          .then((result) => result.records[0].get('exists')),
      ).toBe(true);
    });

    it('return object if user does not exist in neo4j', async () => {
      await neo4jService.write(
        `CREATE (a1:Author {id: "author1"}), (a2:Author {id: "author2"}) RETURN *`,
      );

      const actual = await booksService.addBook('user1', {
        title: 'Title',
        authors: ['author1', 'author2'],
        isbn: '9784845860203',
      });
      expect(actual).toStrictEqual({
        id: expect.any(String),
        title: 'Title',
        isbn: '9784845860203',
      });

      expect(
        await neo4jService
          .read(`MATCH (b:Book {id: $id}) RETURN count(b) AS count`, {
            id: actual?.id,
          })
          .then((result) => result.records[0].get('count').toNumber()),
      ).toBe(1);

      expect(
        await neo4jService
          .read(`MATCH (u:User {id: "user1"}) RETURN count(u) AS count`)
          .then((result) => result.records[0].get('count').toNumber()),
      ).toBe(1);

      expect(
        await neo4jService
          .read(
            `RETURN exists((:User {id: "user1"})-[:RESPONSIBLE_FOR]->(:Book {id: $id})) AS exists`,
            {id: actual?.id},
          )
          .then((result) => result.records[0].get('exists')),
      ).toBe(true);

      expect(
        await neo4jService
          .read(
            `RETURN exists((:Author {id: "author1"})-[:WRITES_BOOK]->(:Book {id: $id})) AS exists`,
            {id: actual?.id},
          )
          .then((result) => result.records[0].get('exists')),
      ).toBe(true);

      expect(
        await neo4jService
          .read(
            `RETURN exists((:Author {id: "author1"})-[:WRITES_BOOK]->(:Book {id: $id})) AS exists`,
            {id: actual?.id},
          )
          .then((result) => result.records[0].get('exists')),
      ).toBe(true);
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
