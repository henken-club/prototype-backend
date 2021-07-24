const getPostPrejudices = (property: 'createdAt', order: 'ASC' | 'DESC') =>
  `
  MATCH (:User {id: $id})-[:POST_PREJUDICE]->(p:Prejudice)
  RETURN
    p.id AS id,
    p.title AS title,
    p.createdAt AS createdAt
  ORDER BY ${property} ${order}
  SKIP $skip LIMIT $limit` as const;
export const CYPHER_GET_USER_POST_PREJUDICES_ORDERBY_CREATED_AT_ASC =
  getPostPrejudices('createdAt', 'ASC');
export const CYPHER_GET_USER_POST_PREJUDICES_ORDERBY_CREATED_AT_DESC =
  getPostPrejudices('createdAt', 'DESC');

const getRecivedPrejudices = (property: 'createdAt', order: 'ASC' | 'DESC') =>
  `
  MATCH (p:Prejudice)-[:PREJUDICE_AGAINST]->(:User {id: $id})
  RETURN
    p.id AS id,
    p.title AS title,
    p.createdAt AS createdAt
  ORDER BY ${property} ${order}
  SKIP $skip LIMIT $limit` as const;
export const CYPHER_GET_USER_RECIVED_PREJUDICES_ORDERBY_CREATED_AT_ASC =
  getRecivedPrejudices('createdAt', 'ASC');
export const CYPHER_GET_USER_RECIVED_PREJUDICES_ORDERBY_CREATED_AT_DESC =
  getRecivedPrejudices('createdAt', 'DESC');

const getPostAnswers = (property: 'createdAt', order: 'ASC' | 'DESC') =>
  `
  MATCH (:User {id: $id})-[:POST_ANSWER]->(a:Answer)
  RETURN
    a.id AS id,
    a.createdAt AS createdAt,
    a.correctness AS correctness,
    a.text AS text
  ORDER BY ${property} ${order}
  SKIP $skip LIMIT $limit` as const;
export const CYPHER_GET_USER_POST_ANSWERS_ORDERBY_CREATED_AT_ASC =
  getPostAnswers('createdAt', 'ASC');
export const CYPHER_GET_USER_POST_ANSWERS_ORDERBY_CREATED_AT_DESC =
  getPostAnswers('createdAt', 'DESC');

export const CYPHER_FOLLOW_USER = `
  MERGE (from {id: $from})-[r:FOLLOWS]->(to {id: $to})
  ON CREATE
    SET r.followedAt = localdatetime()
  RETURN from.id AS fromId, to.id AS toId
`;

export const CYPHER_UNFOLLOW_USER = `
  MATCH (from:User {id: $from})
  MATCH (to:User {id: $to})
  MATCH (from)-[r:FOLLOWS]->(to)
  DELETE r
  RETURN from.id AS fromId, to.id AS toId
`;

export const CYPHER_GET_USER_FOLLOWERS = `
  MATCH (u:User)-[r:FOLLOWS]->(:User {id: $id})
  RETURN
    u.id AS id,
    u.alias AS alias,
    u.displayName AS displayName
  ORDER BY r.followedAt DESC
  SKIP $skip LIMIT $limit
`;
export const CYPHER_GET_USER_FOLLOWERS_COUNT = `
  MATCH p=(:User)-[:FOLLOWS]->(:User {id: $id})
  RETURN count(p) AS count
`;

export const CYPHER_GET_USER_FOLLOWING = `
  MATCH (:User {id: $id})-[r:FOLLOWS]->(u:User)
  RETURN
    u.id AS id,
    u.alias AS alias,
    u.displayName AS displayName
  ORDER BY r.followedAt DESC
  SKIP $skip LIMIT $limit
`;

export const CYPHER_GET_USER_FOLLOWING_COUNT = `
  MATCH p=(:User {id: $id})-[:FOLLOWS]->(u:User)
  RETURN count(p) AS count
`;

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
