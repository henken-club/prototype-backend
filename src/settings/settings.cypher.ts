export const CYPHER_CAN_POST_PREJUDICE_ALL_FOLLOWERS = `
  RETURN EXISTS((:User {id: $to})-[:FOLLOWS]->(:User {id: $from})) AS can
`;

export const CYPHER_CAN_POST_PREJUDICE_MUTUAL_ONLY = `
  RETURN
    EXISTS((:User {id: $from})-[:FOLLOWS]->(:User {id: $to})) AND
    EXISTS((:User {id: $to})-[:FOLLOWS]->(:User {id: $from}))
    AS can
`;
