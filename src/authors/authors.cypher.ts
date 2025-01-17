export const CYPHER_GET_AUTHOR = `
  MATCH (a:Author {id: $id})
  RETURN a.id AS id, a.name AS name
`;

export const CYPHER_GET_ALL_AUTHORS = `
  MATCH (a:Author)
  RETURN a.id AS id, a.name AS name
`;

export const CYPHER_COUNT_ALL_AUTHORS = `
  MATCH (a:Author)
  RETURN count(a) AS count
`;

const getWritesBooks = (parameter: 'title', order: 'ASC' | 'DESC') =>
  `
  MATCH (a:Author {id: $id})-[:WRITES_BOOK]->(b:Book)
  RETURN b.id AS id, b.title AS title, b.isbn AS isbn
  ORDER BY ${parameter} ${order}
  SKIP $skip LIMIT $limit
  ` as const;

export const CYPHER_GET_AUTHOR_WRITES_BOOKS_ORDER_BY_TITLE_ASC = getWritesBooks(
  'title',
  'ASC',
);
export const CYPHER_GET_AUTHOR_WRITES_BOOKS_ORDER_BY_TITLE_DESC =
  getWritesBooks('title', 'DESC');

export const CYPHER_COUNT_AUTHOR_WRITES_BOOKS = `
  MATCH (:Author {id: $id})-[:WRITES_BOOK]->(b:Book)
  RETURN count(b) AS count
`;

export const CYPHER_GET_USER_RESPONSIBLE_FOR_AUTHOR = `
  MATCH (u:User)-[r:RESPONSIBLE_FOR]->(:Author {id: $id})
  RETURN u.id AS id
  ORDER BY r.updatedAt DESC
`;

export const CYPHER_ADD_AUTHOR = `
  MERGE (u:User {id: $userId})
  CREATE (a:Author {id: $id})
  CREATE (u)-[r:RESPONSIBLE_FOR {updatedAt: localdatetime()}]->(a)
  SET a.name=$name
  RETURN a.id AS id, a.name AS name
`;

export const CYPHER_SEARCH_AUTHORS = `
  MATCH (a:Author) WHERE a.name CONTAINS $query
  RETURN a.id AS id, a.name AS name
  ORDER BY apoc.text.levenshteinDistance(a.name, $query), size(a.name), a.name
  SKIP $skip LIMIT $limit
`;

export const CYPHER_COUNT_SEARCH_AUTHORS = `
  MATCH (a:Author) WHERE a.name CONTAINS $query
  RETURN count(a) AS count
`;
