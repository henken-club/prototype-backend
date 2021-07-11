export const CYPHER_GET_PREJUDICE = `
  MATCH (p:Prejudice {id: $id})
  RETURN
    p.id AS id,
    p.title AS title,
    p.createdAt AS createdAt
`;

export const CYPHER_GET_PREJUDICE_USER_FROM = `
  MATCH (u:User)-[:POST_PREJUDICE]->(:Prejudice {id: $id})
  RETURN u.id AS id, u.alias AS alias, u.displayName AS displayName
`;

export const CYPHER_GET_PREJUDICE_USER_TO = `
  MATCH (:Prejudice {id: $id})-[:PREJUDICE_AGAINST]->(u:User)
  RETURN u.id AS id, u.alias AS alias, u.displayName AS displayName
`;

export const CYPHER_GET_PREJUDICE_ANSWER = `
  MATCH (a:Answer)-[:ANSWER_TO]->(:Prejudice {id: $id})
  RETURN
    a.id AS id,
    a.createdAt AS createdAt,
    a.correctness AS correctness,
    a.text AS text
`;

const getRelatedBooks = (property: 'title', order: 'ASC' | 'DESC') =>
  `
  MATCH (:Prejudice {id: $id})-[:RELATED_BOOK]->(b:Book)
  RETURN
    b.id AS id,
    b.title AS title
  ORDER BY ${property} ${order}
  SKIP $skip LIMIT $limit` as const;
export const CYPHER_GET_PREJUDICE_RELATED_BOOKS_ORDERBY_TITLE_AT_ASC =
  getRelatedBooks('title', 'ASC');
export const CYPHER_GET_PREJUDICE_RELATED_BOOKS_ORDERBY_TITLE_AT_DESC =
  getRelatedBooks('title', 'DESC');

export const CYPHER_CREATE_PREJUDICE = `
  MATCH (from:User {id: $from})
  MATCH (to:User {id: $to})
  MATCH (b:Book) WHERE b.id IN $relatedBooks
  MERGE (p:Prejudice {id: $id})
  MERGE (from)-[:POST_PREJUDICE]->(p)-[:PREJUDICE_AGAINST]->(to)
  MERGE (p)-[:RELATED_BOOK]->(b)
  SET p.title = $title, p.createdAt = localdatetime()
  RETURN p.id AS id, p.title AS title, p.createdAt AS createdAt
`;
