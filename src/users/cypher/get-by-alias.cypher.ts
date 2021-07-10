export const cypherGetUserByAlias = `
  MATCH (u:User {alias: $alias})
  RETURN u.id AS id, u.alias AS alias, u.displayName AS displayName
`;
