import { Request, Response, NextFunction } from '@tinyhttp/app';
import { Knex } from 'knex';

import appConfig from '~/config/app';

type WhereTuple = [string, string, any];
type WhereObject = { orWhere: Array<WhereTuple> };
type Filters = Array<WhereObject | WhereTuple>;
type OperatorFunction = (column: string, value: any) => [string, string, any];

const operatorsMap: Record<string, string | OperatorFunction> = {
  eq: '=',
  ne: '!=',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
  in: 'in',
  contains(column: string, value: any) {
    return [column, 'like', `%${value}%`];
  },
};

function translateCondition(condition: WhereTuple): [string, string, any] | null {
  const [column, operator, value] = condition;
  const operatorValue = operatorsMap[operator];
  if (!operatorValue) {
    return null;
  }

  if (typeof operatorValue === 'function') {
    return operatorValue(column, value);
  }
  return [column, operatorValue, value];
}

async function queriesMiddleware(request: Request, _: Response, next: NextFunction) {
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

  try {
    const filtersRequestQuery = query.filters || query['filters[]'];
    let filters: Filters;
    if (Array.isArray(filtersRequestQuery)) {
      filters = filtersRequestQuery.map(item => JSON.parse(item));
    } else if (typeof filtersRequestQuery === 'string') {
      filters = JSON.parse(filtersRequestQuery);
    }

    request.filterBy = (builder: Knex.QueryInterface) => {
      if (!filters?.length) {
        return builder;
      }

      filters.forEach(conditionOrObject => {
        if (Array.isArray(conditionOrObject)) {
          const result = translateCondition(conditionOrObject);
          console.warn({ result });
          if (result) {
            builder.where(...result);
          }
        } else if (conditionOrObject.orWhere) {
          builder.where(whereQb => {
            conditionOrObject.orWhere
              .forEach(condition => {
                const result = translateCondition(condition);
                if (result) {
                  whereQb.orWhere(...result);
                }
              });
          });
        }
      });

      return builder;
    };
  } catch (error) {
    console.warn('Failed while parsing filters object', error);
  }

  next();
}

export default queriesMiddleware;
