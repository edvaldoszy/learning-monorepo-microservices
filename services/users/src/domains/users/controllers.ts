import { Request, Response } from '@tinyhttp/app';

import UnauthorizedError from '~/errors/unauthorized';
import knex from '~/factories/knex';
import { validatetHash } from '~/helpers/bcrypt';
import { generateJwt } from '~/helpers/jwt';

async function login(request: Request, response: Response) {
  const { body } = request;

  const user = await knex('users')
    .where({
      email: body.email,
      active: true,
    })
    .first();

  if (!user) {
    throw new UnauthorizedError(30);
  }
  if (!validatetHash(body.password, user.password)) {
    throw new UnauthorizedError(30);
  }

  const payload = {
    sub: user.id,
    email: user.email,
    role: 'USER',
  };
  const token = generateJwt(payload);

  response
    .json({ token });
}

export default {
  login,
};
