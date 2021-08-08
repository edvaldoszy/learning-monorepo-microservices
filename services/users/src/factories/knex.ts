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

    typeCast(field: any, next: any) {
      const { type, length, string } = field;

      if (type === 'DATE') {
        return string();
      }
      if (type === 'TINY' && length === 1) {
        const value = string();
        switch (value) {
          case '1': return true;
          case '0': return false;
          default: return value;
        }
      }
      return next();
    },
  },
});

export default knex;
