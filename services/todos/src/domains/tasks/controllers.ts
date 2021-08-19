import { pick } from '@monorepo/helpers';
import { Request, Response } from '@tinyhttp/app';

import agenda from '~/factories/agenda';
import mongo from '~/factories/mongo';

const tasksRepository = mongo.db('todos')
  .collection('tasks');

async function create(request: Request, response: Response) {
  const fields = [
    'title',
    'description',
    'due_date',
    'is_done',
    'reminders',
  ];
  let pickedValues = pick(request.body, fields);
  if (pickedValues.due_date) {
    pickedValues = {
      ...pickedValues,
      due_date: new Date(pickedValues.due_date),
    };
  }
  if (Array.isArray(pickedValues.reminders)) {
    const reminders = pickedValues.reminders
      .map((reminder: string) => new Date(reminder)) as Date[];

    pickedValues = {
      ...pickedValues,
      reminders,
    };
  }

  const taskValues = {
    ...pickedValues,
    user_id: request.user.id,
  };

  const task = await tasksRepository
    .insertOne(taskValues)
    .then(result => tasksRepository.findOne({ _id: result.insertedId }));

  if (task && Array.isArray(task.reminders)) {
    const promises = task.reminders.map(reminder => {
      const data = {
        task_id: task._id, // eslint-disable-line no-underscore-dangle
      };
      return agenda.schedule(reminder, 'TaskReminder', data);
    });
    await Promise.all(promises);
  }

  response.status(201)
    .json(task);
}

export default {
  create,
};
