import axios from 'axios';

import EntityMetadata from '~/entities/EntityMetadata';
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

  provider: {
    async fetchAll(context, fields, filters) {
      const headers = forwardAuthorizationHeader(context.request.headers);
      const params = {
        fields,
        filters,
      };
      const response = await axios.get('http://localhost:3001/api/todos/tasks', { params, headers });
      return response.data.result;
    },
    async fetchOne(context, fields, id, filters) {
      const headers = forwardAuthorizationHeader(context.request.headers);
      const params = {
        fields,
        filters,
      };
      const response = await axios.get(`http://localhost:3001/api/todos/tasks/${id}`, { params, headers });
      return response.data.result;
    },
  },
};

export default userMetadata;
