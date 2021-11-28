import DataLoader from 'dataloader';
import { GraphQLResolveInfo } from 'graphql';

import RelationSchema from '~/entities/RelationSchema';

import { getFieldsFromSelectionNode } from './fields';

function createLoaders() {
  return {
    cacheMap: new Map<string, DataLoader<number | string, any>>(),

    hasMany(relationSchema: RelationSchema<any, any>, _args: any, context: any, info: GraphQLResolveInfo) {
      const {
        name, parent, target, targetIdProperty,
      } = relationSchema;
      const cacheKey = `${parent.name}_HasMany_${target.name}_${name}`;
      let loader = this.cacheMap.get(cacheKey);

      if (!loader) {
        loader = new DataLoader(async ids => {
          const [rootSelectionNode] = info.fieldNodes;
          const fields = getFieldsFromSelectionNode(rootSelectionNode);
          const filters = [
            [targetIdProperty, 'in', ids],
          ];
          const records = await target.fetchAll(context, fields, filters);

          const groups = records.reduce((map, record) => {
            const key = record[targetIdProperty];
            const items = map.get(key) || [];
            return map.set(key, items.concat(record));
          }, new Map());
          return ids.map(id => groups.get(id) || []);
        });
        this.cacheMap.set(cacheKey, loader);
      }

      return loader;
    },
  };
}

export default createLoaders;
