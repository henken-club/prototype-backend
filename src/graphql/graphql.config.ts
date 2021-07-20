import * as path from 'path';

import {registerAs} from '@nestjs/config';

export const GraphQLConfig = registerAs('graphql', () => ({
  playground: process.env.NODE_ENV !== 'production',
  debug: process.env.NODE_ENV !== 'production',
  sortSchema: true,
  introspection: true,
  typePaths:
    process.env.NODE_ENV === 'production'
      ? ['dist/**/*.graphql']
      : ['src/**/*.graphql'],
  definitionPath: path.resolve(process.cwd(), 'src/graphql.ts'),
}));
