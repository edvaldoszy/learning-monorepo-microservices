import { Request, Response, NextFunction } from '@tinyhttp/app';

import appConfig from '~/config/app';

async function queryMiddleware(request: Request, _: Response, next: NextFunction) {
  const { query } = request;

  let page = parseInt(query.page as string);
  let limit = parseInt(query.limit as string);

  const isValidPageValue = typeof page === 'number' && page > 0;
  if (!isValidPageValue) {
    page = 1;
  }

  const isValidLimitValue = typeof limit === 'number' && limit > 0 && limit < 10000;
  if (!isValidLimitValue) {
    limit = appConfig.pagination.limit;
  }

  const offset = (page - 1) * limit;

  request.pagination = {
    page,
    limit,
    offset,
  };

  next();
}

export default queryMiddleware;
