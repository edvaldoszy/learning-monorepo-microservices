import { pick } from '@monorepo/helpers';
import { Request, Response } from '@tinyhttp/app';
import isAfter from 'date-fns/isAfter';
import { ObjectId } from 'mongodb';

import agenda from '~/factories/agenda';
import mongo from '~/factories/mongo';

const tasksRepository = mongo.db('todos')
  .collection('tasks');

interface Task {
  _id: string;
  title: string;
  description: string;
  due_date: Date; // eslint-disable-line camelcase
  is_done: boolean; // eslint-disable-line camelcase
  reminders: Date[];
}

function formatValues(request: Request) {
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

  return pickedValues;
}

async function afterCreateOrUpdate(task: Task) {
  if (!Array.isArray(task.reminders)) {
    return;
  }

  await agenda.cancel({
    name: 'TaskReminder',
    data: { task_id: new ObjectId(task._id) }, // eslint-disable-line no-underscore-dangle
  });

  const shouldCreateTaskReminders = !task.is_done
    && isAfter(task.due_date, new Date());

  if (shouldCreateTaskReminders) {
    const promises = task.reminders.map(reminder => {
      const data = {
        task_id: task._id, // eslint-disable-line no-underscore-dangle
      };
      return agenda.schedule(reminder, 'TaskReminder', data);
    });
    await Promise.all(promises);
  }
}

async function create(request: Request, response: Response) {
  const pickedValues = formatValues(request);
  const taskValues = {
    ...pickedValues,
    created_at: new Date(),
    updated_at: new Date(),
    user_id: request.user.id,
  };

  const task = await tasksRepository
    .insertOne(taskValues)
    .then(result => tasksRepository.findOne({ _id: result.insertedId }));

  await afterCreateOrUpdate(task as Task);

  response.status(201)
    .json(task);
}

async function update(request: Request, response: Response) {
  const { taskId } = request.params;
  const pickedValues = formatValues(request);
  const taskValues = {
    ...pickedValues,
    updated_at: new Date(),
    user_id: request.user.id,
  };

  await tasksRepository
    .updateOne({ _id: new ObjectId(taskId) }, { $set: taskValues });
  const task = await tasksRepository.findOne({ _id: new ObjectId(taskId) });

  await afterCreateOrUpdate(task as Task);

  response.status(200)
    .json(task);
}

export default {
  create,
  update,
};
