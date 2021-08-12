// import { pick, omit } from '@monorepo/helpers';
import { Request, Response } from '@tinyhttp/app';

// import PreconditionFailedError from '~/errors/precondition-failed';
// import knex from '~/factories/knex';

async function create(request: Request, response: Response) {
  response.json({});
  // const fields = [
  //   'title',
  //   'description',
  //   'due_date',
  //   'is_done',
  // ];
  // const pickedValues = pick(request.body, fields);
  // const taksValues = {
  //   ...pickedValues,
  // };

  // try {
  //   const [createdUserId] = await knex('users')
  //     .insert(taksValues);
  //   const createdUser = await knex('users')
  //     .where('id', createdUserId)
  //     .first();

  //   response.status(201)
  //     .json(omit(createdUser, ['password']));

  // } catch (err) {
  //   if (err.code === 'ER_DUP_ENTRY' && err.sqlMessage.includes('users.users_email_unique')) {
  //     throw new PreconditionFailedError(100);
  //   }

  //   throw err;
  // }
}

export default {
  create,
  // login,
  // refresh,
};
