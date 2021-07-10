export const CYPHER_GET_USER = `
  MATCH (u:User {alias: $alias})
  RETURN u.id AS id, u.alias AS alias, u.displayName AS displayName
`;
