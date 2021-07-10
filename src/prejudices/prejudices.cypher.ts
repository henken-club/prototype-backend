export const cypherGetPrejudice = `
  MATCH (p:Prejudice {id: $id})
  RETURN
    p.id AS id,
    p.title AS title,
    p.createdAt AS createdAt
`;

export const cypherGetPrejudiceUserFrom = `
  MATCH (u:User)-[:POST_PREJUDICE]->(:Prejudice {id: $id})
  RETURN u.id AS id, u.alias AS alias, u.displayName AS displayName
`;

export const cypherGetPrejudiceUserTo = `
  MATCH (:Prejudice {id: $id})-[:PREJUDICE_AGAINST]->(u:User)
  RETURN u.id AS id, u.alias AS alias, u.displayName AS displayName
`;

export const cypherGetPrejudiceAnswer = `
  MATCH (a:Answer)-[:ANSWER_TO]->(:Prejudice {id: $id})
  RETURN
    a.id AS id,
    a.createdAt AS createdAt,
    a.correctness AS correctness,
    a.text AS text
`;
