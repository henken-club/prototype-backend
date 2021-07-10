export const CYPHER_GET_ANSWER = `
  MATCH (a:Answer {id: $id})
  RETURN
    a.id AS id,
    a.createdAt AS createdAt,
    a.correctness AS correctness,
    a.text AS text
`;

export const CYPHER_GET_ANSWER_TO_PREJUDICE = `
  MATCH (:Answer {id: $id})-[:ANSWER_TO]->(p:Prejudice)
  RETURN
    p.id AS id,
    p.title AS title,
    p.createdAt AS createdAt
`;
