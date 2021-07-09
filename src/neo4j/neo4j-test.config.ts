import {registerAs} from '@nestjs/config';

export const Neo4jTestConfig = registerAs('neo4j-test', () => ({
  url: process.env.TEST_NEO4J_URL!,
}));
