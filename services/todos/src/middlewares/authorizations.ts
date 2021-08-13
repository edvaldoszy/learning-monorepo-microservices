import { Request, Response, NextFunction } from '@tinyhttp/app';

import UnauthorizedError from '~/errors/unauthorized';
import { validateJwt } from '~/helpers/jwt';

function extractAuthWithScheme(scheme: string, authorization: string) {
  const [extractedScheme, extractedValue] = authorization.split(' ') || [];
  if (extractedScheme === scheme) {
    return extractedValue;
  }

  return null;
}

async function authorizationMiddleware(request: Request, _: Response, next: NextFunction) {
  const { authorization } = request.headers;
  if (!authorization) {
    throw new UnauthorizedError(30);
  }

  const token = extractAuthWithScheme('Bearer', authorization);
  if (!token) {
    throw new UnauthorizedError(30);
  }

  const decoded = validateJwt(token);
  request.user = {
    id: decoded.sub,
    email: decoded.email,
  };
  next();
}

export default authorizationMiddleware;
