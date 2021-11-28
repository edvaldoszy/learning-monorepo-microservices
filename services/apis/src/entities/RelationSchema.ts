// eslint-disable-next-line import/no-cycle
import EntitySchema from './EntitySchema';

export enum RelationType {
  BelongsTo = 'belongsTo',
  BelongsToMany = 'belongsToMany',
  HasMany = 'hasMany',
  HasOne = 'hasOne',
}

export type RelationOptions = {
  foreignKey: string,
  foreignKeyTarget?: string,
  through?: string,
  otherKey?: string;
  otherKeyTarget?: string;
};

class RelationSchema<Parent, Target> {

  public parentIdProperty: string;
  public targetIdProperty: string;

  constructor(
    public name: string,
    public type: RelationType,
    public parent: EntitySchema<Parent>,
    public target: EntitySchema<Target>,
    options: RelationOptions,
  ) {
    this.parentIdProperty = this.getParentIdProperty(type, options);
    this.targetIdProperty = this.getTargetIdProperty(type, options);
  }

  private getParentIdProperty(relationType: RelationType, options: RelationOptions): string {
    switch (relationType) {
      case RelationType.BelongsTo:
        return options.foreignKey;
      case RelationType.BelongsToMany:
      case RelationType.HasOne:
      case RelationType.HasMany:
        return options.foreignKeyTarget || this.parent.primaryKey;
      default:
        throw new Error(`No parent id property found for ${this.parent.name} entity`);
    }
  }

  private getTargetIdProperty(relationType: RelationType, options: RelationOptions): string {
    switch (relationType) {
      case RelationType.BelongsToMany:
        return options.otherKeyTarget || this.target.primaryKey;
      case RelationType.BelongsTo:
        return options.foreignKeyTarget || this.target.primaryKey;
      case RelationType.HasOne:
      case RelationType.HasMany:
        return options.foreignKey;
      default:
        throw new Error(`No target id property found for ${this.parent.name} entity`);
    }
  }

}

export default RelationSchema;
