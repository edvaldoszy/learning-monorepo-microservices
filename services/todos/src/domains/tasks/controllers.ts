import { pick } from '@monorepo/helpers';
import { Request, Response } from '@tinyhttp/app';

import mongo from '~/factories/mongo';

const tasksRepository = mongo.db('todos')
  .collection('tasks');

async function create(request: Request, response: Response) {
  const fields = [
    'title',
    'description',
    'due_date',
    'is_done',
  ];
  let pickedValues = pick(request.body, fields);
  if (pickedValues.due_date) {
    pickedValues = {
      ...pickedValues,
      due_date: new Date(pickedValues.due_date),
    };
  }

  const taskValues = {
    ...pickedValues,
    user_id: request.user.id,
  };

  const task = await tasksRepository
    .insertOne(taskValues)
    .then(result => tasksRepository.findOne({ _id: result.insertedId }));

  response.status(201)
    .json(task);
}

export default {
  create,
};
