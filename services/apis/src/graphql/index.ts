import {
  GraphQLBoolean,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
  GraphQLObjectType,
  GraphQLFieldConfigMap,
  GraphQLFieldConfig,
  GraphQLOutputType,
  GraphQLSchema,
} from 'graphql';

import { EntityPropertyMetadata, EntityPropertyType } from '~/entities/EntityMetadata';
import EntitySchema from '~/entities/EntitySchema';
import RelationSchema, { RelationType } from '~/entities/RelationSchema';

import { getFieldsFromSelectionNode } from './fields';

type GraphQLTypesMap = Record<string, GraphQLObjectType<any, any>>;

function getPropertyGraphQLFieldType(propertySchema: EntityPropertyType | EntityPropertyMetadata) {
  const propertyType = typeof propertySchema === 'string' ? propertySchema : propertySchema.type;
  const isOptional = propertyType?.endsWith('?');
  const propertyTypeName = isOptional ? propertyType.slice(0, -1) as EntityPropertyType : propertyType;

  let propertyGraphQLType;
  switch (propertyTypeName) {
    case 'string':
      propertyGraphQLType = GraphQLString;
      break;
    case 'float':
      propertyGraphQLType = GraphQLFloat;
      break;
    case 'integer':
      propertyGraphQLType = GraphQLInt;
      break;
    case 'boolean':
      propertyGraphQLType = GraphQLBoolean;
      break;
    default:
      throw new Error(`No type found for ${propertyTypeName}`);
  }

  return isOptional ? propertyGraphQLType : new GraphQLNonNull(propertyGraphQLType);
}

function createRelationGraphQLField(
  relationSchema: RelationSchema<any, any>,
  CustomType: GraphQLObjectType,
): GraphQLFieldConfig<any, any> {
  const { type: relationType } = relationSchema;

  let defaultValue: null | [];
  let type: GraphQLOutputType;
  let args;

  switch (relationType) {
    case RelationType.HasOne:
    case RelationType.BelongsTo:
      defaultValue = null;
      type = CustomType;
      break;
    case RelationType.HasMany:
    case RelationType.BelongsToMany:
      defaultValue = [];
      type = new GraphQLNonNull(new GraphQLList(CustomType));
      args = {
        query: {
          type: GraphQLString,
        },
      };
      break;
    default:
      throw new Error(`No type found for ${relationType}`);
  }

  return {
    type,
    args,
    resolve(parent, _args, context, info) {
      const parentValue = parent[relationSchema.parentIdProperty];
      if (!parentValue) {
        return defaultValue;
      }
      return context.loaders[relationType](relationSchema, _args, context, info)
        .load(parentValue);
    },
  };
}

async function init(schemas: EntitySchema<any>[]) {
  const types: GraphQLTypesMap = schemas.reduce((typesObject, schema) => {
    const { name } = schema;
    const GraphQLCustomType = new GraphQLObjectType({
      name,
      fields: () => {
        const properties = Object.entries(schema.properties).reduce((fieldsObject, propertyEntry) => {
          const [propertyName, propertySchema] = propertyEntry;
          return {
            ...fieldsObject,
            [propertyName]: {
              type: getPropertyGraphQLFieldType(propertySchema),
            },
          };
        }, {});

        const relations = Object.entries(schema.relations).reduce((relationsObject, relationEntry) => {
          const [relationName, relationSchema] = relationEntry;
          const CustomType = types[relationSchema.target.name];
          return {
            ...relationsObject,
            [relationName]: createRelationGraphQLField(relationSchema, CustomType),
          };
        }, {});

        return { ...properties, ...relations };
      },
    });

    return {
      ...typesObject,
      [name]: GraphQLCustomType,
    };

  }, {});

  const rootQueryFields = schemas.reduce<GraphQLFieldConfigMap<any, any>>((fieldsObject, schema) => {
    const { name } = schema;
    const GraphQLCustomType = types[name];

    return {
      ...fieldsObject,
      [`fetchOne${name}`]: {
        type: GraphQLCustomType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
        },
        async resolve(_parent, args, context, info) {
          const [rootSelectionNode] = info.fieldNodes;
          const fields = getFieldsFromSelectionNode(rootSelectionNode);
          const filters: any[] = [];
          return schema.fetchOne?.(context, fields, args.id, filters);
        },
      },
      [`fetchAll${name}`]: {
        type: new GraphQLNonNull(new GraphQLList(GraphQLCustomType)),
        async resolve(_parent, _args, context, info) {
          const [rootSelectionNode] = info.fieldNodes;
          const fields = getFieldsFromSelectionNode(rootSelectionNode);
          const filters: any[] = [];
          return schema.fetchAll?.(context, fields, filters);
        },
      },
    };
  }, {});

  const RootQueryType = new GraphQLObjectType({
    name: 'RootQuery',
    fields: rootQueryFields,
  });

  return new GraphQLSchema({
    query: RootQueryType,
  });
}

export default init;
