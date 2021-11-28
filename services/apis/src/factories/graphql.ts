import { graphqlHTTP } from 'express-graphql';

import initSchemas from '../entities';
import initGraphQL from '../graphql';
import createLoaders from '../graphql/loaders';

async function createExpressGraphQL(path: string, cwd: string) {

  const entitiesSchemas = await initSchemas(path, cwd);
  const rootSchema = await initGraphQL(entitiesSchemas);

  return graphqlHTTP(request => {
    return {
      schema: rootSchema,
      graphiql: true,
      context: {
        request,
        loaders: createLoaders(),
      },
    };
  });

}

export default createExpressGraphQL;
