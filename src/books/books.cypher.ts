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
  CREATE (b:Book {id: $id, title: $title})
  RETURN b.id AS id, b.title AS title
`;
