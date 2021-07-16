export const CYPHER_GET_BOOK = `
  MATCH (b:Book {id: $id})
  RETURN b.id AS id, b.title AS title
`;

const getAuthors = (property: 'name', order: 'ASC' | 'DESC') =>
  `
  MATCH (b:Book {id: $id})
  MATCH (a:Author)-[:WRITED_BOOK]->(b)
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

export const CYPHER_ADD_BOOK = `
  MERGE (u:User {id: $userId})
  CREATE (b:Book {id: $id})
  SET b.title=$title
  CREATE (u)-[:RESPONSIBLE_FOR]->(b)
  RETURN b.id AS id, b.title AS title
`;

export const CYPHER_GET_USER_RESPONSIBLE_FOR_BOOK = `
  MATCH (u:User)-[r:RESPONSIBLE_FOR]->(:Book {id: $id})
  RETURN u.id AS id
  ORDER BY r.updatedAt DESC
`;
