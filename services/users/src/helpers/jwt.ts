import jwt, { Secret, SignOptions, VerifyOptions } from 'jsonwebtoken';

import authConfig from '~/config/auth';

type JwtUserPayload = {
  sub: string;
  email?: string;
  role: string;
};

export function generateJwt(payload: JwtUserPayload) {
  const privateKey: Secret = {
    passphrase: '',
    key: authConfig.privateKey,
  };
  const signOptions: SignOptions = {
    algorithm: 'RS256',
    expiresIn: authConfig.expires,
  };
  return jwt.sign(payload, privateKey, signOptions);
}

export function validateJwt(token: string) {
  const publicKey: Secret = {
    passphrase: '',
    key: authConfig.publicKey,
  };
  const verifyOptions: VerifyOptions = {
    algorithms: ['RS256'],
  };
  return jwt.verify(token, publicKey, verifyOptions);
}
