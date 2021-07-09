const base = (property: 'name', order: 'ASC' | 'DESC') =>
  `
  MATCH (b:Book {id: $id})
  MATCH (a:Author)-[:WRITED_BOOK]->(b)
  RETURN a.id AS id, a.name AS name
  ORDER BY ${property} ${order}
  SKIP $skip LIMIT $limit` as const;

export const cypherGetAuthorsOrderByNameAsc = base('name', 'ASC');
export const cypherGetAuthorsOrderByNameDesc = base('name', 'DESC');

export const cypherCountAuthors = `
  MATCH (b:Book {id: $id})
  MATCH (a:Author)-[:WRITED_BOOK]->(b)
  RETURN count(a) AS count`;
