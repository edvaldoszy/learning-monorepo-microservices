const {
  MONGO_HOST,
  MONGO_PORT = '27017',
  MONGO_USERNAME,
  MONGO_PASSWORD,
} = process.env;

const mongoConfig = {
  host: MONGO_HOST,
  port: Number(MONGO_PORT),
  username: MONGO_USERNAME,
  password: MONGO_PASSWORD,
};

export default mongoConfig;
