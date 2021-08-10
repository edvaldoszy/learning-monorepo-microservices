import { Request, Response, NextFunction } from '@tinyhttp/app';

import ForbiddenError from '~/errors/forbidden';
import UnauthorizedError from '~/errors/unauthorized';
import knex from '~/factories/knex';
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
  const user = await knex('users')
    .where({
      id: decoded.sub,
      active: true,
    })
    .first();

  if (!user) {
    throw new ForbiddenError(31);
  }

  request.user = user;
  next();
}

export default authorizationMiddleware;
