export { Request } from '@tinyhttp/app';

declare module '@tinyhttp/app' {
  interface Request {
    user: App.Auth.User;
    pagination?: {
      page: number;
      limit: number;
      offset: number;
    };
    filterBy?: (builder: object) => object;
  }
}
