import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';

import {Neo4jTestModule} from '~/neo4j/neo4j-test.module';
import {Neo4jService} from '~/neo4j/neo4j.service';
import {IdModule} from '~/id/id.module';
import {UsersService} from '~/users/users.service';

describe('UsersService', () => {
  let app: INestApplication;

  let neo4jService: Neo4jService;

  let usersService: UsersService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [Neo4jTestModule, IdModule],
      providers: [UsersService],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    neo4jService = module.get<Neo4jService>(Neo4jService);
    usersService = module.get<UsersService>(UsersService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await neo4jService.write(`MATCH (n) DETACH DELETE n`);
  });

  afterAll(async () => {
    await app.close();
  });

  it('to be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('followUser()', () => {
    it('return object if success following', async () => {
      await neo4jService.write(`
        CREATE (from:User {id: "user1"}), (to:User {id: "user2"})
        RETURN *
      `);
      const actual = await usersService.followUser('user1', 'user2');
      expect(actual).toStrictEqual({fromId: 'user1', toId: 'user2'});

      const neo4jResult = await neo4jService.read(
        `MATCH (f)-[r:FOLLOWS]->(t) RETURN f.id AS fromId, t.id AS toId`,
      );
      expect(neo4jResult.records).toHaveLength(1);
      expect(neo4jResult.records[0].get('fromId')).toBe('user1');
      expect(neo4jResult.records[0].get('toId')).toBe('user2');
    });

    it('return object if already followed', async () => {
      await neo4jService.write(`
        CREATE (from:User {id: "user1"}), (to:User {id: "user2"})
        CREATE (from)-[:FOLLOWS]->(to)
        RETURN *
      `);
      const actual = await usersService.followUser('user1', 'user2');
      expect(actual).toStrictEqual({fromId: 'user1', toId: 'user2'});

      const neo4jResult = await neo4jService.read(
        `MATCH (f)-[r:FOLLOWS]->(t) RETURN f.id AS fromId, t.id AS toId`,
      );
      expect(neo4jResult.records).toHaveLength(1);
      expect(neo4jResult.records[0].get('fromId')).toBe('user1');
      expect(neo4jResult.records[0].get('toId')).toBe('user2');
    });

    it('return null if from user not exist', async () => {
      await neo4jService.write(`
        CREATE (from:User {id: "user1"})
        RETURN *
      `);
      const actual = await usersService.followUser('user1', 'user2');
      expect(actual).toBeNull();

      const neo4jResult = await neo4jService.read(
        `MATCH p=()-[r:FOLLOWS]->() RETURN count(p) AS count`,
      );
      expect(neo4jResult.records).toHaveLength(1);
      expect(neo4jResult.records[0].get('count').toNumber()).toBe(0);
    });

    it('return null if to user not exist', async () => {
      await neo4jService.write(`
        CREATE (to:User {id: "user2"})
        RETURN *
      `);
      const actual = await usersService.followUser('user1', 'user2');
      expect(actual).toBeNull();

      const neo4jResult = await neo4jService.read(
        `MATCH p=()-[r:FOLLOWS]->() RETURN count(p) AS count`,
      );
      expect(neo4jResult.records).toHaveLength(1);
      expect(neo4jResult.records[0].get('count').toNumber()).toBe(0);
    });
  });

  describe('unfollowUser()', () => {
    it('return object if unfollow success', async () => {
      await neo4jService.write(`
        CREATE (from:User {id: "user1"}), (to:User {id: "user2"})
        CREATE (from)-[:FOLLOWS]->(to)
        RETURN *
      `);
      const actual = await usersService.unfollowUser('user1', 'user2');
      expect(actual).toStrictEqual({fromId: 'user1', toId: 'user2'});

      const neo4jResult = await neo4jService.read(
        `MATCH p=()-[r:FOLLOWS]->() RETURN count(p) AS count`,
      );
      expect(neo4jResult.records).toHaveLength(1);
      expect(neo4jResult.records[0].get('count').toNumber()).toBe(0);
    });

    it('return null if not followed', async () => {
      await neo4jService.write(`
        CREATE (from:User {id: "user1"}), (to:User {id: "user2"})
        RETURN *
      `);
      const actual = await usersService.unfollowUser('user1', 'user2');
      expect(actual).toBeNull();

      const neo4jResult = await neo4jService.read(
        `MATCH p=()-[r:FOLLOWS]->() RETURN count(p) AS count`,
      );
      expect(neo4jResult.records).toHaveLength(1);
      expect(neo4jResult.records[0].get('count').toNumber()).toBe(0);
    });

    it('return null if from user not exist', async () => {
      await neo4jService.write(`
        CREATE (from:User {id: "user1"})
        RETURN *
      `);
      const actual = await usersService.unfollowUser('user1', 'user2');
      expect(actual).toBeNull();

      const neo4jResult = await neo4jService.read(
        `MATCH p=()-[r:FOLLOWS]->() RETURN count(p) AS count`,
      );
      expect(neo4jResult.records).toHaveLength(1);
      expect(neo4jResult.records[0].get('count').toNumber()).toBe(0);
    });

    it('return null if to user not exist', async () => {
      await neo4jService.write(`
        CREATE (to:User {id: "user2"})
        RETURN *
      `);
      const actual = await usersService.unfollowUser('user1', 'user2');
      expect(actual).toBeNull();

      const neo4jResult = await neo4jService.read(
        `MATCH p=()-[r:FOLLOWS]->() RETURN count(p) AS count`,
      );
      expect(neo4jResult.records).toHaveLength(1);
      expect(neo4jResult.records[0].get('count').toNumber()).toBe(0);
    });
  });
});
