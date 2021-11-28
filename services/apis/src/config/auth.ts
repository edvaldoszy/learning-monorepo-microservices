const {
  AUTH_EXPIRES,
  AUTH_PRIVATE_KEY,
  AUTH_PUBLIC_KEY,
} = process.env;

const authConfig = {
  expires: AUTH_EXPIRES,
  privateKey: AUTH_PRIVATE_KEY as string,
  publicKey: AUTH_PUBLIC_KEY as string,
};

export default authConfig;
