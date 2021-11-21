export { Request } from '@tinyhttp/app';

declare module '@tinyhttp/app' {
  interface Request {
    user: App.Auth.User;
  }
}
