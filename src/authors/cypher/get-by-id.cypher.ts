export const cypherGetById = `
  MATCH (a:Author {id: $id})
  RETURN a.id AS id, a.name AS name
`;
