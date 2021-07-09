import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';

import {Neo4jTestModule} from '~/neo4j/neo4j-test.module';
import {Neo4jService} from '~/neo4j/neo4j.service';
import {BooksService} from '~/books/books.service';
import {IdModule} from '~/id/id.module';

describe('BooksService', () => {
  let app: INestApplication;

  let neo4jService: Neo4jService;

  let booksService: BooksService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [Neo4jTestModule, IdModule],
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
    it('return object if success', async () => {
      const actual = await booksService.addBook({title: 'Title'});
      expect(actual).toStrictEqual({
        id: expect.any(String),
        title: 'Title',
      });
    });
  });
});
