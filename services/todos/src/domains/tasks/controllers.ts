import { pick } from '@monorepo/helpers';
import { Request, Response } from '@tinyhttp/app';
import isAfter from 'date-fns/isAfter';
import { Document, ObjectId } from 'mongodb';

import NotFoundError from '~/errors/not-found';
import agenda from '~/factories/agenda';
import mongo from '~/factories/mongo';

interface Task extends Document {
  _id: ObjectId;
  title: string;
  description: string;
  due_date: Date; // eslint-disable-line camelcase
  is_done: boolean; // eslint-disable-line camelcase
  reminders: Date[];
}

const tasksRepository = mongo.db('todos')
  .collection<Task>('tasks');

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

function deleteAllTaskReminders(taskId: string) {
  return agenda.cancel({
    name: 'TaskReminder',
    data: { task_id: new ObjectId(taskId) },
  });
}

async function afterCreateOrUpdate(task: Task) {
  if (!Array.isArray(task.reminders)) {
    return;
  }

  await deleteAllTaskReminders(String(task._id)); // eslint-disable-line no-underscore-dangle

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

  await afterCreateOrUpdate(task!);

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

  await afterCreateOrUpdate(task!);

  response.status(200)
    .json(task);
}

async function find(request: Request, response: Response) {
  const { page, limit, offset } = request.pagination!;

  const cursor = tasksRepository
    .find({
      user_id: request.user.id,
    });

  const [
    total,
    tasks,
  ] = await Promise.all([
    cursor.count(),
    cursor
      .skip(offset)
      .limit(limit)
      .toArray(),
  ]);

  response.json({
    metadata: {
      page,
      limit,
      total,
    },
    result: tasks,
  });
}

async function get(request: Request, response: Response) {
  const task = await tasksRepository
    .findOne({
      user_id: request.user.id,
      _id: new ObjectId(request.params.taskId),
    });
  if (!task) {
    throw new NotFoundError(20);
  }

  response.json(task);
}

async function remove(request: Request, response: Response) {
  const { taskId } = request.params;

  const task = await tasksRepository
    .findOne({
      user_id: request.user.id,
      _id: new ObjectId(taskId),
    });
  if (!task) {
    throw new NotFoundError(20);
  }

  await deleteAllTaskReminders(taskId);

  await tasksRepository
    .deleteOne({
      user_id: request.user.id,
      _id: new ObjectId(taskId),
    });

  response.sendStatus(204);
}

export default {
  create,
  update,
  find,
  get,
  remove,
};
