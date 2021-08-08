import { pick, omit } from '@monorepo/helpers';
import { Request, Response } from '@tinyhttp/app';

import PreconditionFailedError from '~/errors/precondition-failed';
import UnauthorizedError from '~/errors/unauthorized';
import knex from '~/factories/knex';
import { generateHash, validatetHash } from '~/helpers/bcrypt';
import { generateJwt } from '~/helpers/jwt';

async function register(request: Request, response: Response) {
  const fields = [
    'name',
    'email',
    'password',
  ];
  const pickedValues = pick(request.body, fields);
  const userValues = {
    ...pickedValues,
    password: generateHash(pickedValues.password),
  };

  try {
    const [createdUserId] = await knex('users')
      .insert(userValues);
    const createdUser = await knex('users')
      .where('id', createdUserId)
      .first();

    response.status(201)
      .json(omit(createdUser, ['password']));

  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY' && err.sqlMessage.includes('users.users_email_unique')) {
      throw new PreconditionFailedError(100);
    }

    throw err;
  }
}

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
    role: 'USER',
  };
  const token = generateJwt(payload);

  response
    .json({
      token,
      user: omit(user, ['password']),
    });
}

async function refresh(request: Request, response: Response) {
  const user = await knex('users')
    .where({
      id: request.user.id,
      active: true,
    })
    .first();

  const payload = {
    sub: user.id,
    role: 'USER',
  };
  const token = generateJwt(payload);

  response
    .json({ token });
}

export default {
  register,
  login,
  refresh,
};
