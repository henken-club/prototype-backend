const base = (parameter: 'title', order: 'ASC' | 'DESC') =>
  `
  MATCH (a:Author {id: $id})-[:WRITED_BOOK]->(b:Book)
  RETURN b.id AS id, b.title AS title
  ORDER BY ${parameter} ${order}
  SKIP $skip LIMIT $limit
  ` as const;

export const cypherGetWritedBooksOrderByNameAsc = base('title', 'ASC');
export const cypherGetWritedBooksOrderByNameDesc = base('title', 'DESC');
