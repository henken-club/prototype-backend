export const CYPHER_GET_PREJUDICE_BY_ID = `
  MATCH (p:Prejudice {id: $id})
  RETURN p.id AS id
`;

export const CYPHER_GET_PREJUDICE_BY_USER_ID_AND_NUMBER = `
  MATCH (:User {id: $posted})-[:POST_PREJUDICE]->(p:Prejudice {number: $number})-[:PREJUDICE_AGAINST]->(:User {id: $received})
  RETURN p.id AS id
`;

export const CYPHER_GET_ALL_PREJUDICES = `
  MATCH (p:Prejudice)
  RETURN p.id AS id
`;

export const CYPHER_RESOLVE_PREJUDICE_TITLE = `
  MATCH (p:Prejudice {id: $id})
  RETURN p.title AS title
`;

export const CYPHER_RESOLVE_PREJUDICE_CREATED_AT = `
  MATCH (p:Prejudice {id: $id})
  RETURN p.createdAt AS createdAt
`;

export const CYPHER_RESOLVE_PREJUDICE_NUMBER = `
  MATCH (p:Prejudice {id: $id})
  RETURN p.number AS number
`;

export const CYPHER_RESOLVE_PREJUDICE_USER_POSTED = `
  MATCH (u:User)-[:POST_PREJUDICE]->(:Prejudice {id: $id})
  RETURN u.id AS id
`;

export const CYPHER_RESOLVE_PREJUDICE_USER_RECEIVED = `
  MATCH (:Prejudice {id: $id})-[:PREJUDICE_AGAINST]->(u:User)
  RETURN u.id AS id
`;

export const CYPHER_RESOLVE_PREJUDICE_ANSWER = `
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

export const CYPHER_COUNT_PREJUDICE_RELATED_BOOKS = `
  MATCH (:Prejudice {id: $id})-[:RELATED_BOOK]->(b:Book)
  RETURN count(b) AS count
`;

export const CYPHER_CREATE_PREJUDICE = `
  MATCH (pu:User {id: $posted})
  MATCH (ru:User {id: $received})
  MATCH (b:Book) WHERE b.id IN $relatedBooks
  WITH pu, ru, collect(b) AS bc
  CALL {
      WITH pu, ru
      MATCH (pu)-[:POST_PREJUDICE]->(al:Prejudice)-[:PREJUDICE_AGAINST]->(ru)
      RETURN count(al) + 1 AS number
  }
  CALL {
      WITH pu, ru, number
      CREATE (pu)-[:POST_PREJUDICE]->(p:Prejudice)-[:PREJUDICE_AGAINST]->(ru)
      SET p.id = randomUUID(), p.number = number, p.createdAt = timestamp(), p.title = $title
      RETURN p
  }
  CALL {
      WITH bc, p
      UNWIND bc AS b
      CREATE (p)-[r:RELATED_BOOK]->(b)
      RETURN r
  }
  RETURN DISTINCT p.id AS id
`;
