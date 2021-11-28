import fastGlob from 'fast-glob';
import path from 'path';

import EntityMetadata, { RelationMetadata } from './EntityMetadata';
import EntitySchema from './EntitySchema';
import { RelationType } from './RelationSchema';

async function init(pattern: string, cwd: string) {
  const entries = await fastGlob(pattern, { cwd });

  const imports = entries.map(async relativePath => {
    const absolutePath = path.resolve(cwd, relativePath);
    const requiredModule = await import(absolutePath);

    const metadata: EntityMetadata<any> = requiredModule.default || requiredModule;
    return new EntitySchema<any>(metadata);
  });

  const schemas = await Promise.all(imports);

  schemas.forEach(schema => {
    const { hasOne, hasMany, belongsTo } = schema.metadata;
    const relationsObject = { hasOne, hasMany, belongsTo };

    Object.entries(relationsObject).forEach(([relationType, relationTypeObject]) => {
      if (!relationTypeObject) {
        return;
      }

      Object.entries(relationTypeObject).forEach(([relationName, relationSchema]: [string, RelationMetadata]) => {
        const { target: targetEntityName, ...options } = relationSchema;
        const targetSchema = schemas.find(item => item.name === targetEntityName);
        if (!targetSchema) {
          throw new Error(`No entity schema found for target "${targetEntityName}"`);
        }

        schema[relationType as RelationType](relationName, targetSchema, options);
      });
    });
  });

  return schemas;
}

export default init;
