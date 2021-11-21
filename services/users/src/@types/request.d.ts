import { Knex } from 'knex';

export { Request } from '@tinyhttp/app';

declare module '@tinyhttp/app' {
  interface Request {
    user: App.Auth.User;
    filterBy?: (builder: Knex.QueryBuilder) => void;
  }
}
