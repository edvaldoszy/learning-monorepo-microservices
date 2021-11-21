import { Request, Response, NextFunction } from '@tinyhttp/app';
import { ObjectId } from 'mongodb';

import appConfig from '~/config/app';

type WhereTuple = [string, string, any];
type WhereObject = { andWhere: Array<WhereTuple>, orWhere: Array<WhereTuple> };
type Filters = Array<WhereObject | WhereTuple>;
type OperatorFunction = (value: any) => { [key: string]: any };

const operatorsMap: Record<string, string | OperatorFunction> = {
  eq: '$eq',
  ne: '$ne',
  gt: '$gt',
  gte: '$gte',
  lt: '$lt',
  lte: '$lte',
  in: '$in',
  contains(value: any) {
    const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return { $regex: new RegExp(`.*${escapedValue}.*`, 'i') };
  },
};

function translateCondition(condition: WhereTuple) {
  const [column, operator, value] = condition;
  const operatorValue = operatorsMap[operator];
  if (!operatorValue) {
    return null;
  }
  if (typeof operatorValue === 'function') {
    return {
      [column]: operatorValue(value),
    };
  }
  if (column === '_id' && ObjectId.isValid(value)) {
    return {
      [column]: { [operatorValue]: new ObjectId(value) },
    };
  }
  const DATE_REGEX = /^\d{4}(?:-\d{2}){2}T(?:[0-1][0-9]|2[0-3])(?::[0-5][0-9]){2}(?:\.[0-9]{3})?Z$/g;
  if (typeof value === 'string' && value.length >= 20 && value.length <= 24 && DATE_REGEX.test(value)) {
    return {
      [column]: { [operatorValue]: new Date(value) },
    };
  }

  return {
    [column]: { [operatorValue]: value },
  };

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

  let filters: Filters;
  const { filters: filtersRequestQuery } = query;
  if (Array.isArray(filtersRequestQuery)) {
    filters = filtersRequestQuery.map(item => JSON.parse(item));
  } else if (typeof filtersRequestQuery === 'string') {
    filters = JSON.parse(filtersRequestQuery);
  }

  request.filterBy = (queryObject: object) => {
    if (!filters) {
      return queryObject;
    }

    const andConditions = filters
      .map(conditionOrObject => {
        if (Array.isArray(conditionOrObject)) {
          return translateCondition(conditionOrObject);
        }
        if (conditionOrObject.orWhere) {
          return {
            $or: conditionOrObject.orWhere.map(translateCondition),
          };
        }
        return conditionOrObject.andWhere.map(translateCondition);
      })
      .filter(Boolean);
    return {
      ...queryObject,
      $and: andConditions,
    };
  };

  next();
}

export default queriesMiddleware;
