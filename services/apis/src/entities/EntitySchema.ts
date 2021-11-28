import EntityMetadata from '~/entities/EntityMetadata';

// eslint-disable-next-line import/no-cycle
import RelationSchema, { RelationOptions, RelationType } from './RelationSchema';

class EntitySchema<T> {

  public relations: Record<string, RelationSchema<T, any>>;

  public get name() {
    return this.metadata.name;
  }

  public get primaryKey() {
    return this.metadata.primaryKey;
  }

  public get properties() {
    return this.metadata.properties;
  }

  constructor(public metadata: EntityMetadata<T>) {
    this.relations = {};
  }

  private addRelation<Target>(
    name: string,
    type: RelationType,
    target: EntitySchema<Target>,
    options: RelationOptions,
  ): void {
    const relation = new RelationSchema(name, type, this, target, options);
    this.relations[name] = relation;
  }

  hasOne<Target>(name: string, target: EntitySchema<Target>, options: RelationOptions): void {
    this.addRelation(name, RelationType.HasOne, target, options);
  }

  hasMany<Target>(name: string, target: EntitySchema<Target>, options: RelationOptions): void {
    this.addRelation(name, RelationType.HasMany, target, options);
  }

  belongsTo<Target>(name: string, target: EntitySchema<Target>, options: RelationOptions): void {
    this.addRelation(name, RelationType.BelongsTo, target, options);
  }

  belongsToMany<Target>(name: string, target: EntitySchema<Target>, options: RelationOptions): void {
    this.addRelation(name, RelationType.BelongsTo, target, options);
  }

  fetchOne(context: any, fields: string[], id: any, filters?: any) {
    return this.metadata.provider.fetchOne(context, fields, id, filters);
  }

  fetchAll(context: any, fields: string[], filters: any) {
    return this.metadata.provider.fetchAll(context, fields, filters);
  }

}

export default EntitySchema;
