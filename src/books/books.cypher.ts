export const cypherGetBookById = `
  MATCH (b:Book {id: $id})
  RETURN b.id AS id, b.title AS title
`;

export const cypherAddBook = `
  CREATE (b:Book {id: $id, title: $title})
  RETURN b.id AS id, b.title AS title
`;
