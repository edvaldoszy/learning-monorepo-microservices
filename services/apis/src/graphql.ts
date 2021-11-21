import { Request } from '@tinyhttp/app';
import axios from 'axios';
// import DataLoader from 'dataloader';
import { graphqlHTTP } from 'express-graphql';
import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

const types: any = {};
// const loaders = new Map<string, DataLoader<any, any>>();

// function getBelongsToLoader(cacheKey: string, context: Request) {
//   let loader = loaders.get(cacheKey);
//   if (!loader) {
//     loader = new DataLoader(async ids => {
//       const params = {
//         filters: [
//           ['_id', 'in', ids],
//         ],
//       };
//       const headers = {
//         Authorization: context.headers.authorization!,
//       };
//       const response = await axios.get('http://localhost:3001/api/todos/lists', { params, headers });

//       const groups = (response.data.result as any[])
//         .reduce((map, record) => {
//           const mapKey = record._id;
//           console.warn({ mapKey });
//           return map.set(mapKey, record);
//         }, new Map());

//       return ids.map(id => groups.get(id) || null);
//     });
//     loaders.set(cacheKey, loader);
//   }

//   return loader;
// }

const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(source) {
        return source._id;
      },
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
    },
    due_date: {
      type: new GraphQLNonNull(GraphQLString),
    },
    is_done: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    reminders: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
    },
    list: {
      type: types.ListType,
      async resolve(parent, _args, context: Request) {
        // console.warn({ context });
        // if (!parent.list_id) {
        //   return null;
        // }

        // const lists = await getBelongsToLoader('task-list', context)
        //   .load(parent.list_id);
        // return lists;
      },
    },
  }),
});

const ListType = new GraphQLObjectType({
  name: 'List',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(source) {
        return source._id;
      },
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

Object.assign(types, {
  UserType,
  TaskType,
  ListType,
});

const RootQueryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    users: {
      type: new GraphQLNonNull(new GraphQLList(UserType)),
      async resolve() {
        const response = await axios.get('http://localhost:3000/api/users');
        return response.data.result;
      },
    },
    tasks: {
      type: new GraphQLNonNull(new GraphQLList(TaskType)),
      async resolve(_source, _args, context: Request) {
        const headers = {
          Authorization: context.headers.authorization!,
        };
        const response = await axios.get('http://localhost:3001/api/todos/tasks', { headers });
        return response.data.result;
      },
    },
    lists: {
      type: new GraphQLNonNull(new GraphQLList(ListType)),
      async resolve(_source, _args, context: Request) {
        const headers = {
          Authorization: context.headers.authorization!,
        };
        const response = await axios.get('http://localhost:3001/api/todos/lists', { headers });
        return response.data.result;
      },
    },
  },
});

function loaders() {
  return {
    cacheMap: new Map(),

    belongsTo() {
      const loader = this.cacheMap.get('');
      // if (!loader) {
      //   loader = new DataLoader<number, any>(ids => {

      //     const groups = records
      //       .reduce((map, record) => {
      //         const mapKey = record[idAttribute];
      //         return map.set(mapKey, record);
      //       }, new Map());

      //     return ids.map(id => groups.get(id) || null);
      //   });
      // }

      return loader;
    },
  };
}

// const graphql = graphqlHTTP({
//   graphiql: true,
//   context
//   schema: new GraphQLSchema({
//     query: RootQueryType,
//   }),
// });
const schema = new GraphQLSchema({
  query: RootQueryType,
});
const graphql = graphqlHTTP(request => {
  return {
    schema,
    graphiql: true,
    context: {
      request,
      loaders: loaders(),
    },
  };
});

export default graphql;
