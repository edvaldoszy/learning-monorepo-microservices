import EntityMetadata from '~/entities/EntityMetadata';
import todosApi from '~/factories/todos-api';
import { forwardAuthorizationHeader } from '~/helpers/auth';

export class Task {

  _id: string;
  title: string;
  description: string;
  is_done: boolean;

}

const userMetadata: EntityMetadata<Task> = {
  modelClass: Task,
  name: 'Task',
  primaryKey: '_id',

  properties: {
    _id: 'string',
    title: 'string',
    description: 'string',
    is_done: 'boolean',
  },

  belongsTo: {
    user: {
      target: 'User',
      foreignKey: 'user_id',
    },
  },

  provider: {
    async fetchAll(context, fields, filters) {
      const headers = forwardAuthorizationHeader(context.request.headers);
      const params = {
        fields: JSON.stringify(fields),
        filters: JSON.stringify(filters),
      };
      const response = await todosApi.get('/api/todos/tasks', { params, headers });
      return response.data.result;
    },
    async fetchOne(context, fields, id, filters) {
      const headers = forwardAuthorizationHeader(context.request.headers);
      const params = {
        fields: JSON.stringify(fields),
        filters: JSON.stringify(filters),
      };
      const response = await todosApi.get(`/api/todos/tasks/${id}`, { params, headers });
      return response.data.result;
    },
  },
};

export default userMetadata;
