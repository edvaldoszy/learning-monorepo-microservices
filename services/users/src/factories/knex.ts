import createKnex from 'knex';

import databaseConfig from '~/config/database';

const knex = createKnex({
  client: 'mysql2',
  debug: true,
  connection: {
    host: databaseConfig.host,
    port: databaseConfig.port,
    user: databaseConfig.username,
    password: databaseConfig.password,
    database: databaseConfig.database,
    charset: databaseConfig.charset,
  },
});

export default knex;
