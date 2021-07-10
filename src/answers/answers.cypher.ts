export const cypherGetAnswer = `
  MATCH (a:Answer {id: $id})
  RETURN
    a.id AS id,
    a.createdAt AS createdAt,
    a.correctness AS correctness,
    a.text AS text
`;

export const cypherGetAnswerToPrejudice = `
  MATCH (:Answer {id: $id})-[:ANSWER_TO]->(p:Prejudice)
  RETURN
    p.id AS id,
    p.title AS title,
    p.createdAt AS createdAt
`;
