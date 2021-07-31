import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import routes from './routes';

const app = new App();
app.use(logger());
app.use(routes);

export default app;
