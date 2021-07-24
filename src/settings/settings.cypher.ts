export const CYPHER_CAN_POST_PREJUDICE_ALL_FOLLOWERS = `
  MATCH (from:User {id: $from})
  MATCH (to:User {id: $to})
  RETURN EXISTS((from)-[:FOLLOWS]->(to)) AS can
`;

export const CYPHER_CAN_POST_PREJUDICE_MUTUAL_ONLY = `
  MATCH (from:User {id: $from})
  MATCH (to:User {id: $to})
  RETURN EXISTS((from)-[:FOLLOWS]->(to)) AND EXISTS((to)-[:FOLLOWS]->(from)) AS can
`;
