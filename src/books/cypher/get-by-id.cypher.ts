export const cypherGetById = `
  MATCH (b:Book {id: $id})
  RETURN b.id AS id, b.title AS title
`;
