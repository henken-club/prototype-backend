export const CYPHER_GET_AUTHOR = `
  MATCH (a:Author {id: $id})
  RETURN a.id AS id, a.name AS name
`;

const getWritedBooks = (parameter: 'title', order: 'ASC' | 'DESC') =>
  `
  MATCH (a:Author {id: $id})-[:WRITED_BOOK]->(b:Book)
  RETURN b.id AS id, b.title AS title
  ORDER BY ${parameter} ${order}
  SKIP $skip LIMIT $limit
  ` as const;

export const CYPHER_GET_AUTHOR_WRITED_BOOKS_ORDER_BY_TITLE_ASC = getWritedBooks(
  'title',
  'ASC',
);
export const CYPHER_GET_AUTHOR_WRITED_BOOKS_ORDER_BY_TITLE_DESC =
  getWritedBooks('title', 'DESC');
