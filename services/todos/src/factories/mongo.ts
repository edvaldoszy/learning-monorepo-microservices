import { MongoClient, MongoClientOptions } from 'mongodb';

import mongoConfig from '~/config/mongo';

const uri = `mongodb://${mongoConfig.host}:${mongoConfig.port}`;
const options: MongoClientOptions = {
  auth: {
    username: mongoConfig.username,
    password: mongoConfig.password,
  },
};

const client = new MongoClient(uri, options);

export default client;
