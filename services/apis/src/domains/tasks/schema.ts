import axios from 'axios';

import { forwardAuthorizationHeader } from '~/helpers/auth';

const schema = {
  name: 'Task',

  belongsTo: {
    target: 'List',
    async resolve(context: any, ids: any[]) {
      const { request } = context;

      const headers = forwardAuthorizationHeader(request.headers);
      const params = {
        filters: [
          ['_id', 'in', ids],
        ],
      };
      const response = await axios.get('http://localhost:3001/api/todos/lists', { params, headers });
      return response.data.result;
    },
  },
};

export default schema;
