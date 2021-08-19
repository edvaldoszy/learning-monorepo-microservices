import Agenda from 'agenda';
import { MongoClientOptions } from 'mongodb';

import mongoConfig from '~/config/mongo';

const uri = `mongodb://${mongoConfig.host}:${mongoConfig.port}/todos`;
const options: MongoClientOptions = {
  authSource: 'admin',
  auth: {
    username: mongoConfig.username,
    password: mongoConfig.password,
  },
};

const agenda = new Agenda({
  db: {
    address: uri,
    collection: 'jobs',
    options,
  },
});

export default agenda;
