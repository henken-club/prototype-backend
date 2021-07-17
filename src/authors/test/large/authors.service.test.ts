import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';

import {Neo4jService} from '~/neo4j/neo4j.service';
import {IdModule} from '~/id/id.module';
import {Neo4jModule} from '~/neo4j/neo4j.module';
import {AuthorsService} from '~/authors/authors.service';

describe('AuthorsService', () => {
  let app: INestApplication;

  let neo4jService: Neo4jService;

  let authorsService: AuthorsService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [Neo4jModule, IdModule],
      providers: [AuthorsService],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    neo4jService = module.get<Neo4jService>(Neo4jService);
    authorsService = module.get<AuthorsService>(AuthorsService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await neo4jService.write(`MATCH (n) DETACH DELETE n`);
  });

  afterAll(async () => {
    await app.close();
  });

  it('to be defined', () => {
    expect(authorsService).toBeDefined();
  });

  describe('findById()', () => {
    it('return null if id does not exist', async () => {
      const actual = await authorsService.getById('1');
      expect(actual).toBeNull();
    });

    it('return object if id exists', async () => {
      await neo4jService.write(
        `CREATE (a:Author {id: "1", name: "Name"}) RETURN *`,
      );

      const actual = await authorsService.getById('1');

      expect(actual).toStrictEqual({
        id: '1',
        name: 'Name',
      });
    });
  });

  describe('addAuthor()', () => {
    it('return object if user exist in neo4j', async () => {
      await neo4jService.write(`CREATE (u:User {id: "1"}) RETURN *`);

      const actual = await authorsService.addAuthor({
        name: 'Name',
        userId: '1',
      });
      expect(actual).toStrictEqual({
        id: expect.any(String),
        name: 'Name',
      });

      const authorCount = await neo4jService
        .read(`MATCH (a:Author) RETURN count(a) AS count`)
        .then((result) => result.records[0].get('count').toNumber());
      expect(authorCount).toBe(1);

      const userCount = await neo4jService
        .read(`MATCH (u:User) RETURN count(u) AS count`)
        .then((result) => result.records[0].get('count').toNumber());
      expect(userCount).toBe(1);

      const responsibleCount = await neo4jService
        .read(
          `MATCH (:User)-[r:RESPONSIBLE_FOR]->(:Author) RETURN count(r) AS count`,
        )
        .then((result) => result.records[0].get('count').toNumber());
      expect(responsibleCount).toBe(1);
    });

    it('return object if user does not exist in neo4j', async () => {
      const actual = await authorsService.addAuthor({
        name: 'Name',
        userId: '1',
      });
      expect(actual).toStrictEqual({
        id: expect.any(String),
        name: 'Name',
      });

      const authorCount = await neo4jService
        .read(`MATCH (a:Author) RETURN count(a) AS count`)
        .then((result) => result.records[0].get('count').toNumber());
      expect(authorCount).toBe(1);

      const userCount = await neo4jService
        .read(`MATCH (u:User) RETURN count(u) AS count`)
        .then((result) => result.records[0].get('count').toNumber());
      expect(userCount).toBe(1);

      const responsibleCount = await neo4jService
        .read(
          `MATCH (:User)-[r:RESPONSIBLE_FOR]->(:Author) RETURN count(r) AS count`,
        )
        .then((result) => result.records[0].get('count').toNumber());
      expect(responsibleCount).toBe(1);
    });
  });

  describe('getUserResponsibleFor', () => {
    it('return object if success', async () => {
      await neo4jService.write(
        `
        CREATE (a:Author {id: "author1"}), (u1:User {id: "user1"}), (u2:User {id: "user2"})
        CREATE (u1)-[:RESPONSIBLE_FOR {updatedAt: localdatetime({year: 2021})}]->(a)
        CREATE (u2)-[:RESPONSIBLE_FOR {updatedAt: localdatetime({year: 2020})}]->(a)
        RETURN *
        `,
      );

      const actual = await authorsService.getUserResponsibleFor('author1');
      expect(actual).toStrictEqual([{id: 'user1'}, {id: 'user2'}]);
    });

    it('return empty array if author does not exist', async () => {
      const actual = await authorsService.getUserResponsibleFor('author1');
      expect(actual).toStrictEqual([]);
    });
  });
});
