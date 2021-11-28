const {
  MYSQL_HOST,
  MYSQL_PORT = '3306',
  MYSQL_USERNAME,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env;

const databaseConfig = {
  host: MYSQL_HOST,
  port: Number(MYSQL_PORT),
  username: MYSQL_USERNAME,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  charset: 'utf8mb4',
};

export default databaseConfig;
