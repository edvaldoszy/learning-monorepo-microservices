import { Request, Response, NextFunction } from '@tinyhttp/app';
import { Knex } from 'knex';

type OperatorFunction = (value: any) => [string, any];

const operatorsMap: Record<string, string | OperatorFunction> = {
  eq: '=',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
  between: 'between',
  in: 'in',
  contains(value: any) {
    return ['like', `%${value}%`];
  },
};

function translateOperator(operator: string, value: any) {
  const operatorValue = operatorsMap[operator];
  if (typeof operatorValue === 'string') {
    return [operatorValue, value];
  } if (typeof operatorValue === 'function') {
    return operatorValue(value);
  }
  return [null, value];
}

function isObject(value: any): value is object {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isPrimitiveValue(value: any): value is string {
  if (value === null) {
    return true;
  }
  const type = typeof value;
  if (type === 'string' || type === 'number' || type === 'boolean') {
    return true;
  }
  return false;
}

function addWhereCondition(
  query: Knex.QueryBuilder,
  column: string,
  conditionsObjectOrValue: object | string,
  isOr: boolean = false,
) {
  const func = isOr ? 'orWhere' : 'andWhere';
  if (isPrimitiveValue(conditionsObjectOrValue)) {
    query[func](column, conditionsObjectOrValue);
    return query;
  }

  if (isObject(conditionsObjectOrValue)) {
    Object.entries(conditionsObjectOrValue)
      .map(entry => translateOperator(...entry))
      .forEach(entry => {
        console.warn({ entry });
        const [operator, value] = entry;
        if (operator) {
          query[func](column, operator, value);
        }
      });
    return query;
  }

  return query;
}

async function queriesMiddleware(request: Request, _: Response, next: NextFunction) {
  const filtersObjectOrArray = JSON.parse(request.query.filters as string) as object | object[];

  request.filterBy = (query: Knex.QueryBuilder) => {
    if (Array.isArray(filtersObjectOrArray)) {
      query.where(whereQb => {
        filtersObjectOrArray
          .filter(isObject)
          .forEach(filterObject => {
            whereQb.orWhere(orWhereQb => {
              Object.entries(filterObject)
                .forEach(entry => {
                  const [column, conditions] = entry;
                  addWhereCondition(orWhereQb, column, conditions);
                });
            });
          });
      });

    } else if (isObject(filtersObjectOrArray)) {
      Object.entries(filtersObjectOrArray)
        .forEach(entry => {
          console.warn({ entry });
          const [column, conditionsObjectOrArray] = entry;
          if (Array.isArray(conditionsObjectOrArray)) {
            query.where(whereQb => {
              conditionsObjectOrArray
                .filter(isObject)
                .forEach(conditionsObject => {
                  addWhereCondition(whereQb, column, conditionsObject, true);
                });
            });
          } else {
            addWhereCondition(query, column, conditionsObjectOrArray);
          }
        });
    }
  };

  next();
}

export default queriesMiddleware;
