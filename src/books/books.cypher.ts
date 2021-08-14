export const CYPHER_GET_BOOK = `
  MATCH (b:Book {id: $id})
  RETURN b.id AS id, b.title AS title, b.isbn AS isbn
`;

export const CYPHER_GET_ALL_BOOKS = `
  MATCH (b:Book)
  RETURN b.id AS id, b.title AS title, b.isbn AS isbn
`;

export const CYPHER_COUNT_ALL_BOOKS = `
  MATCH (b:Book)
  RETURN count(b) AS count
`;

const getAuthors = (property: 'name', order: 'ASC' | 'DESC') =>
  `
  MATCH (b:Book {id: $id})
  MATCH (a:Author)-[:WRITES_BOOK]->(b)
  RETURN a.id AS id, a.name AS name
  ORDER BY ${property} ${order}
  SKIP $skip LIMIT $limit` as const;

export const CYPHER_GET_BOOK_AUTHORS_ORDER_BY_NAME_ASC = getAuthors(
  'name',
  'ASC',
);
export const CYPHER_GET_BOOK_AUTHORS_ORDER_BY_NAME_DESC = getAuthors(
  'name',
  'DESC',
);

export const CYPHER_GET_BOOK_AUTHORS_COUNT = `
  MATCH (a:Author)-[:WRITES_BOOK]->(:Book {id: $id})
  RETURN count(a) AS count
`;

export const CYPHER_GET_USER_RESPONSIBLE_FOR_BOOK = `
  MATCH (u:User)-[r:RESPONSIBLE_FOR]->(:Book {id: $id})
  RETURN u.id AS id
  ORDER BY r.updatedAt DESC
`;

export const CYPHER_ADD_BOOK = `
  MATCH (a:Author) WHERE a.id IN $authors
  MERGE (u:User {id: $userId})
  WITH u, collect(a) AS ac
  CALL {
    WITH u
    CREATE (u)-[r:RESPONSIBLE_FOR]->(b:Book)
    SET b.id = $id, b.title=$title, b.isbn = $isbn
    SET r.updatedAt = localdatetime()
    RETURN b
  }
  CALL {
    WITH ac, b
    UNWIND ac AS a
    CREATE (a)-[r:WRITES_BOOK]->(b)
    RETURN r
  }
  RETURN DISTINCT b.id AS id, b.title AS title, b.isbn AS isbn
`;
