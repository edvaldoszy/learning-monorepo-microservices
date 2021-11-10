import { pick } from '@monorepo/helpers';
import { Request, Response } from '@tinyhttp/app';
import { Document, ObjectId } from 'mongodb';

import NotFoundError from '~/errors/not-found';
import PreconditionFailedError from '~/errors/precondition-failed';
import mongo from '~/factories/mongo';

interface List extends Document {
  _id: ObjectId;
  name: string;
  description: string;
  active: boolean;
}

const listsRepository = mongo.db('todos')
  .collection<List>('lists');
const tasksRepository = mongo.db('todos')
  .collection<List>('tasks');

function formatValues(request: Request) {
  const fields = [
    'name',
    'description',
    'active',
  ];
  return pick(request.body, fields);
}

async function create(request: Request, response: Response) {
  const pickedValues = formatValues(request);
  const taskValues = {
    ...pickedValues,
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
    user_id: request.user.id,
  };

  const list = await listsRepository
    .insertOne(taskValues)
    .then(result => listsRepository.findOne({ _id: result.insertedId }));

  response.status(201)
    .json(list);
}

async function update(request: Request, response: Response) {
  const { listId } = request.params;
  const pickedValues = formatValues(request);
  const listValues = {
    ...pickedValues,
    updated_at: new Date(),
  };

  await listsRepository
    .updateOne({ _id: new ObjectId(listId) }, { $set: listValues });
  const list = await listsRepository.findOne({ _id: new ObjectId(listId) });

  response.status(200)
    .json(list);
}

async function find(request: Request, response: Response) {
  const { page, limit, offset } = request.pagination!;

  const cursor = listsRepository
    .find({
      user_id: request.user.id,
    });

  const [
    total,
    lists,
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
    result: lists,
  });
}

async function get(request: Request, response: Response) {
  const list = await listsRepository
    .findOne({
      user_id: request.user.id,
      _id: new ObjectId(request.params.listId),
    });
  if (!list) {
    throw new NotFoundError(20);
  }

  response.json(list);
}

async function remove(request: Request, response: Response) {
  const { listId } = request.params;

  const list = await listsRepository
    .findOne({
      user_id: request.user.id,
      _id: new ObjectId(listId),
    });
  if (!list) {
    throw new NotFoundError(20);
  }

  const tasksCount = await tasksRepository
    .find({
      list_id: list._id, // eslint-disable-line no-underscore-dangle
    })
    .count();
  if (tasksCount) {
    throw new PreconditionFailedError(200);
  }

  await listsRepository
    .deleteOne({
      user_id: request.user.id,
      _id: new ObjectId(listId),
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
