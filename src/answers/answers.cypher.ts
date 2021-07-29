export const CYPHER_RESOLVE_ANSWER_PREJUDICE = `
  MATCH (:Answer {id: $id})-[:ANSWER_TO]->(p:Prejudice)
  RETURN p.id AS id
`;

export const CYPHER_RESOLVE_ANSWER_CORRECTNESS = `
  MATCH (a:Answer {id: $id})
  RETURN a.correctness AS correctness
`;

export const CYPHER_RESOLVE_ANSWER_TEXT = `
  MATCH (a:Answer {id: $id})
  RETURN a.text AS text
`;

export const CYPHER_RESOLVE_ANSWER_CREATED_AT = `
  MATCH (a:Answer {id: $id})
  RETURN a.createdAt AS createdAt
`;

export const CYPHER_GET_ANSWER_BY_ID = `
  MATCH (a:Answer {id: $id})
  RETURN a.id AS id
`;

export const CYPHER_GET_ANSWER_BY_USER_ID_AND_NUMBER = `
  MATCH (:User {id: $post})-[:POST_PREJUDICE]->(p:Prejudice {number: $number})-[:PREJUDICE_AGAINST]->(:User {id: $received})
  MATCH (a:Answer)-[:ANSWER_TO]->(p)
  RETURN a.id AS id
`;

export const CYPHER_GET_ALL_ANSWERS = `
  MATCH (a:Answer)
  RETURN a.id AS id
`;
