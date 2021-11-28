const BOOLEAN_TYPES = [
  'boolean',
  'boolean?',
] as const;

const NUMBER_TYPES = [
  'integer',
  'integer?',
  'float',
  'float?',
] as const;

const STRING_TYPES = [
  'string',
  'string?',
] as const;

type BooleanProperyType = typeof BOOLEAN_TYPES[number];
type NumberPropertyType = typeof NUMBER_TYPES[number];
type StringProperyType = typeof STRING_TYPES[number];

export type Constructor<T = unknown> = new (...args: any[]) => T;

export type EntityPropertyType = BooleanProperyType | NumberPropertyType | StringProperyType;
export type PrimitiveType = string | number | boolean;

export type EntityPropertyMetadata = {
  type: EntityPropertyType;
  resolve?(): any | void;
};

export type HasOneMetadata = {
  target: string;
  foreignKey: string;
  foreignKeyTarget?: string;
};

export type HasManyMetadata = {
  target: string;
  foreignKey: string;
  foreignKeyTarget?: string;
};

export type BelongsToMetadata = {
  target: string;
  foreignKey: string;
  foreignKeyTarget?: string;
};

export type RelationMetadata = HasOneMetadata | HasManyMetadata | BelongsToMetadata;

export interface EntityProvider<T, C = any> {
  fetchAll(context: C, fields: string[], filters: any): Promise<T[]>;
  fetchOne(context: C, fields: string[], id: any, filters?: any): Promise<T | null>;
}

interface EntityMetadata<T> {
  modelClass?: Constructor<T>,
  name: string;
  primaryKey: keyof T extends string ? keyof T : never;

  properties: {
    [P in keyof T]: EntityPropertyType | EntityPropertyMetadata;
  };

  hasOne?: Record<string, HasOneMetadata>;
  hasMany?: Record<string, HasManyMetadata>;
  belongsTo?: Record<string, BelongsToMetadata>;

  provider: EntityProvider<T>;
}

export default EntityMetadata;
