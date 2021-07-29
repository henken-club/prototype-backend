export const CYPHER_GET_PREJUDICE = `
  MATCH (p:Prejudice {id: $id})
  RETURN
    p.id AS id,
    p.title AS title,
    p.createdAt AS createdAt
`;

export const CYPHER_GET_PREJUDICE_FROM_USER_ID_AND_NUMBER = `
  MATCH (:User {id: $post})-[:POST_PREJUDICE]->(p:Prejudice {number: $number})-[:PREJUDICE_AGAINST]->(:User {id: $recived})
  RETURN
    p.id AS id,
    p.title AS title,
    p.createdAt AS createdAt
`;

export const CYPHER_ALL_PREJUDICES = `
  MATCH (p:Prejudice)
  RETURN
    p.id AS id,
    p.title AS title,
    p.createdAt AS createdAt
`;

export const CYPHER_GET_PREJUDICE_USER_FROM = `
  MATCH (u:User)-[:POST_PREJUDICE]->(:Prejudice {id: $id})
  RETURN u.id AS id
`;

export const CYPHER_GET_PREJUDICE_USER_TO = `
  MATCH (:Prejudice {id: $id})-[:PREJUDICE_AGAINST]->(u:User)
  RETURN u.id AS id
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
  MATCH (b:Book) WHERE b.id IN $relatedBooks
  MERGE (p:Prejudice {id: $id})
  MERGE (from:User {id: $from})
  MERGE (to:User {id: $to})
  MERGE (from)-[:POST_PREJUDICE]->(p)-[:PREJUDICE_AGAINST]->(to)
  MERGE (p)-[:RELATED_BOOK]->(b)
  SET p.title = $title, p.createdAt = localdatetime()
  RETURN DISTINCT p.id AS id, p.title AS title, p.createdAt AS createdAt
`;
