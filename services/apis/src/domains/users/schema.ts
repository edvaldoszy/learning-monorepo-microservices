import EntityMetadata from '~/entities/EntityMetadata';
import usersApi from '~/factories/users-api';
import { forwardAuthorizationHeader } from '~/helpers/auth';

export class User {

  id: string;
  name: string;
  email: string;

}

const userMetadata: EntityMetadata<User> = {
  modelClass: User,
  name: 'User',
  primaryKey: 'id',

  properties: {
    id: 'integer',
    name: 'string',
    email: 'string',
  },

  hasMany: {
    tasks: {
      target: 'Task',
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
      const response = await usersApi.get('/api/users', { params, headers });
      return response.data.result;
    },
    async fetchOne(context, fields, id, filters) {
      const headers = forwardAuthorizationHeader(context.request.headers);
      const params = {
        fields: JSON.stringify(fields),
        filters: JSON.stringify(filters),
      };
      const response = await usersApi.get(`/api/users/${id}`, { params, headers });
      return response.data.result;
    },
  },
};

export default userMetadata;
