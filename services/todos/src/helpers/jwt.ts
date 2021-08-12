import jwt, {
  VerifyOptions, JwtPayload,
} from 'jsonwebtoken';

import authConfig from '~/config/auth';

interface JwtUserPayload extends JwtPayload {
  sub: string;
  role: string;
}

export function validateJwt(token: string): JwtUserPayload {
  const verifyOptions: VerifyOptions = {
    algorithms: ['RS256'],
  };
  return jwt.verify(token, authConfig.publicKey, verifyOptions) as JwtUserPayload;
}
