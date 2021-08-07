import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';

import {Neo4jService} from '~/neo4j/neo4j.service';
import {UsersService} from '~/users/users.service';
import {PrismaModule} from '~/prisma/prisma.module';
import {PrismaService} from '~/prisma/prisma.service';
import {cleanPrisma} from '~/prisma/prisma.utils';
import {Neo4jModule} from '~/neo4j/neo4j.module';

describe('UsersService', () => {
  let app: INestApplication;

  let prismaService: PrismaService;
  let neo4jService: Neo4jService;

  let usersService: UsersService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [Neo4jModule, PrismaModule],
      providers: [UsersService],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    prismaService = module.get<PrismaService>(PrismaService);
    neo4jService = module.get<Neo4jService>(Neo4jService);
    usersService = module.get<UsersService>(UsersService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await neo4jService.write(`MATCH (n) DETACH DELETE n`);
    await cleanPrisma();
  });

  afterAll(async () => {
    await app.close();
  });

  it('to be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('getById', () => {
    it('return object if success', async () => {
      await prismaService.user.create({
        data: {
          id: 'id',
          alias: 'alias',
          displayName: 'DisplayName',
          password: 'password',
        },
      });

      const actual = await usersService.getById('id');
      expect(actual).toStrictEqual({id: 'id'});
    });

    it('return null if user does not exist', async () => {
      const actual = await usersService.getById('id');
      expect(actual).toBeNull();
    });
  });

  describe('getByAlias', () => {
    it('return object if alias exactly', async () => {
      await prismaService.user.create({
        data: {
          id: 'id',
          alias: 'alias',
          displayName: 'DisplayName',
          password: 'password',
        },
      });

      const actual = await usersService.getByAlias('alias');
      expect(actual).toStrictEqual({id: 'id'});
    });

    it('return object if alias ignorecase', async () => {
      await prismaService.user.create({
        data: {
          id: 'id',
          alias: 'alias',
          displayName: 'DisplayName',
          password: 'password',
        },
      });

      const actual = await usersService.getByAlias('AliAS');
      expect(actual).toStrictEqual({id: 'id'});
    });

    it('return null if user does not exist', async () => {
      const actual = await usersService.getByAlias('alias');
      expect(actual).toBeNull();
    });
  });

  describe('getFollowing', () => {
    it.each([
      [
        0,
        3,
        [
          {id: 'user2', alias: 'alias2', displayName: 'Display2'},
          {id: 'user3', alias: 'alias3', displayName: 'Display3'},
          {id: 'user4', alias: 'alias4', displayName: 'Display4'},
        ],
      ],
      [
        0,
        2,
        [
          {id: 'user2', alias: 'alias2', displayName: 'Display2'},
          {id: 'user3', alias: 'alias3', displayName: 'Display3'},
        ],
      ],
      [0, 0, []],
      [
        1,
        3,
        [
          {id: 'user3', alias: 'alias3', displayName: 'Display3'},
          {id: 'user4', alias: 'alias4', displayName: 'Display4'},
        ],
      ],
      [3, 3, []],
    ])(
      'success skip:%i limit:%i if user already exists in neo4j',
      async (skip, limit, expected) => {
        await neo4jService.write(`
          CREATE
                (u1:User {id: "user1", alias: "alias1", displayName: "Display1"}),
                (u2:User {id: "user2", alias: "alias2", displayName: "Display2"}),
                (u3:User {id: "user3", alias: "alias3", displayName: "Display3"}),
                (u4:User {id: "user4", alias: "alias4", displayName: "Display4"})
          CREATE (u1)-[:FOLLOWS {followedAt: localdatetime({year: 2002})}]->(u2)
          CREATE (u1)-[:FOLLOWS {followedAt: localdatetime({year: 2001})}]->(u3)
          CREATE (u1)-[:FOLLOWS {followedAt: localdatetime({year: 2000})}]->(u4)
          RETURN *
        `);
        const actual = await usersService.resolveFollowings('user1', {
          skip,
          limit,
        });
        expect(actual).toStrictEqual(expected);
      },
    );

    it('return empty array if user does not exist', async () => {
      const actual = await usersService.resolveFollowings('user1', {
        skip: 0,
        limit: 3,
      });
      expect(actual).toStrictEqual([]);
    });
  });

  describe('getFollowingCount', () => {
    it('return total count of following', async () => {
      await neo4jService.write(`
        CREATE
              (u1:User {id: "user1", alias: "alias1", displayName: "Display1"}),
              (u2:User {id: "user2", alias: "alias2", displayName: "Display2"}),
              (u3:User {id: "user3", alias: "alias3", displayName: "Display3"}),
              (u4:User {id: "user4", alias: "alias4", displayName: "Display4"})
        CREATE (u1)-[:FOLLOWS {followedAt: localdatetime({year: 2002})}]->(u2)
        CREATE (u1)-[:FOLLOWS {followedAt: localdatetime({year: 2001})}]->(u3)
        CREATE (u1)-[:FOLLOWS {followedAt: localdatetime({year: 2000})}]->(u4)
        RETURN *
      `);

      const actual = await usersService.countFollowings('user1');
      expect(actual).toBe(3);
    });

    it('return 0 if user does not exist', async () => {
      const actual = await usersService.countFollowings('user1');
      expect(actual).toBe(0);
    });
  });

  describe('getFollowers', () => {
    it.each([
      [
        0,
        3,
        [
          {id: 'user2', alias: 'alias2', displayName: 'Display2'},
          {id: 'user3', alias: 'alias3', displayName: 'Display3'},
          {id: 'user4', alias: 'alias4', displayName: 'Display4'},
        ],
      ],
      [
        0,
        2,
        [
          {id: 'user2', alias: 'alias2', displayName: 'Display2'},
          {id: 'user3', alias: 'alias3', displayName: 'Display3'},
        ],
      ],
      [0, 0, []],
      [
        1,
        3,
        [
          {id: 'user3', alias: 'alias3', displayName: 'Display3'},
          {id: 'user4', alias: 'alias4', displayName: 'Display4'},
        ],
      ],
      [3, 3, []],
    ])(
      'success skip:%i limit:%i if user already exists in neo4j',
      async (skip, limit, expected) => {
        await neo4jService.write(`
          CREATE
                (u1:User {id: "user1", alias: "alias1", displayName: "Display1"}),
                (u2:User {id: "user2", alias: "alias2", displayName: "Display2"}),
                (u3:User {id: "user3", alias: "alias3", displayName: "Display3"}),
                (u4:User {id: "user4", alias: "alias4", displayName: "Display4"})
          CREATE (u2)-[:FOLLOWS {followedAt: localdatetime({year: 2002})}]->(u1)
          CREATE (u3)-[:FOLLOWS {followedAt: localdatetime({year: 2001})}]->(u1)
          CREATE (u4)-[:FOLLOWS {followedAt: localdatetime({year: 2000})}]->(u1)
          RETURN *
        `);
        const actual = await usersService.resolveFollowers('user1', {
          skip,
          limit,
        });
        expect(actual).toStrictEqual(expected);
      },
    );

    it('return empty array if user does not exist', async () => {
      const actual = await usersService.resolveFollowers('user1', {
        skip: 0,
        limit: 3,
      });
      expect(actual).toStrictEqual([]);
    });
  });

  describe('getFollowersCount', () => {
    it('return total count of followers', async () => {
      await neo4jService.write(`
        CREATE
              (u1:User {id: "user1", alias: "alias1", displayName: "Display1"}),
              (u2:User {id: "user2", alias: "alias2", displayName: "Display2"}),
              (u3:User {id: "user3", alias: "alias3", displayName: "Display3"}),
              (u4:User {id: "user4", alias: "alias4", displayName: "Display4"})
        CREATE (u2)-[:FOLLOWS {followedAt: localdatetime({year: 2002})}]->(u1)
        CREATE (u3)-[:FOLLOWS {followedAt: localdatetime({year: 2001})}]->(u1)
        CREATE (u4)-[:FOLLOWS {followedAt: localdatetime({year: 2000})}]->(u1)
        RETURN *
      `);

      const actual = await usersService.countFollowers('user1');
      expect(actual).toBe(3);
    });

    it('return 0 if user does not exist', async () => {
      const actual = await usersService.countFollowers('user1');
      expect(actual).toBe(0);
    });
  });

  describe('isFollowing', () => {
    it('return true if followed', async () => {
      await neo4jService.write(`
        CREATE (from:User {id: "from"}), (to:User {id: "to"})
        CREATE (from)-[:FOLLOWS]->(to)
        RETURN *
      `);

      const actual = await usersService.isFollowing('from', 'to');
      expect(actual).toBe(true);
    });

    it('return false if not followed', async () => {
      await neo4jService.write(`
        CREATE (from:User {id: "from"}), (to:User {id: "to"})
        RETURN *
      `);

      const actual = await usersService.isFollowing('from', 'to');
      expect(actual).toBe(false);
    });

    it('return false from user does not exist', async () => {
      await neo4jService.write(`
        CREATE (to:User {id: "to"})
        RETURN *
      `);

      const actual = await usersService.isFollowing('from', 'to');
      expect(actual).toBe(false);
    });

    it('return false to user does not exist', async () => {
      await neo4jService.write(`
        CREATE (from:User {id: "from"})
        RETURN *
      `);

      const actual = await usersService.isFollowing('from', 'to');
      expect(actual).toBe(false);
    });
  });

  describe('followUser()', () => {
    it('return object if success following', async () => {
      await neo4jService.write(`
        CREATE (from:User {id: "user1"}), (to:User {id: "user2"})
        RETURN *
      `);
      const actual = await usersService.followUser('user1', 'user2');
      expect(actual).toStrictEqual({from: {id: 'user1'}, to: {id: 'user2'}});

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
      expect(actual).toStrictEqual({from: {id: 'user1'}, to: {id: 'user2'}});

      const neo4jResult = await neo4jService.read(
        `MATCH (f)-[r:FOLLOWS]->(t) RETURN f.id AS fromId, t.id AS toId`,
      );
      expect(neo4jResult.records).toHaveLength(1);
      expect(neo4jResult.records[0].get('fromId')).toBe('user1');
      expect(neo4jResult.records[0].get('toId')).toBe('user2');
    });

    it('return object if from user not exist in neo4j', async () => {
      await neo4jService.write(`
        CREATE (from:User {id: "user1"})
        RETURN *
      `);
      const actual = await usersService.followUser('user1', 'user2');
      expect(actual).toStrictEqual({from: {id: 'user1'}, to: {id: 'user2'}});

      const neo4jResult = await neo4jService.read(
        `MATCH (f)-[r:FOLLOWS]->(t) RETURN f.id AS fromId, t.id AS toId`,
      );
      expect(neo4jResult.records).toHaveLength(1);
      expect(neo4jResult.records[0].get('fromId')).toBe('user1');
      expect(neo4jResult.records[0].get('toId')).toBe('user2');
    });

    it('return object if to user not exist in neo4j', async () => {
      await neo4jService.write(`
        CREATE (to:User {id: "user2"})
        RETURN *
      `);
      const actual = await usersService.followUser('user1', 'user2');
      expect(actual).toStrictEqual({from: {id: 'user1'}, to: {id: 'user2'}});

      const neo4jResult = await neo4jService.read(
        `MATCH (f)-[r:FOLLOWS]->(t) RETURN f.id AS fromId, t.id AS toId`,
      );
      expect(neo4jResult.records).toHaveLength(1);
      expect(neo4jResult.records[0].get('fromId')).toBe('user1');
      expect(neo4jResult.records[0].get('toId')).toBe('user2');
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
      expect(actual).toStrictEqual({from: {id: 'user1'}, to: {id: 'user2'}});

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
      await expect(usersService.unfollowUser('user1', 'user2')).rejects.toThrow(
        'Failed to unfollow',
      );

      const neo4jResult = await neo4jService.read(
        `MATCH p=()-[r:FOLLOWS]->() RETURN count(p) AS count`,
      );
      expect(neo4jResult.records).toHaveLength(1);
      expect(neo4jResult.records[0].get('count').toNumber()).toBe(0);
    });

    it('return null if from user not exist in neo4j', async () => {
      await neo4jService.write(`
        CREATE (from:User {id: "user1"})
        RETURN *
      `);
      await expect(usersService.unfollowUser('user1', 'user2')).rejects.toThrow(
        'Failed to unfollow',
      );

      const neo4jResult = await neo4jService.read(
        `MATCH p=()-[r:FOLLOWS]->() RETURN count(p) AS count`,
      );
      expect(neo4jResult.records).toHaveLength(1);
      expect(neo4jResult.records[0].get('count').toNumber()).toBe(0);
    });

    it('return null if to user not exist in neo4j', async () => {
      await neo4jService.write(`
        CREATE (to:User {id: "user2"})
        RETURN *
      `);
      await expect(usersService.unfollowUser('user1', 'user2')).rejects.toThrow(
        'Failed to unfollow',
      );

      const neo4jResult = await neo4jService.read(
        `MATCH p=()-[r:FOLLOWS]->() RETURN count(p) AS count`,
      );
      expect(neo4jResult.records).toHaveLength(1);
      expect(neo4jResult.records[0].get('count').toNumber()).toBe(0);
    });
  });
});
