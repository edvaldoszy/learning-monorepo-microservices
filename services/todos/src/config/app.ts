const { PORT } = process.env;

const appConfig = {
  port: PORT,

  pagination: {
    limit: 100,
  },
};

export default appConfig;
