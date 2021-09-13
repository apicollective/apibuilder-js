import invariant from 'invariant';
import FullyQualifiedName from '../language/FullyQualifiedName';
import ApiBuilderField from './ApiBuilderField';
import ApiBuilderUnion from './ApiBuilderUnion';
import type {
  ApiBuilderModelConfig, ApiBuilderType,
} from './types';
import type ApiBuilderService from './ApiBuilderService';

export default class ApiBuilderModel {
  private config: ApiBuilderModelConfig;

  private fullyQualifiedName: FullyQualifiedName;

  private service: ApiBuilderService;

  /**
   * Returns the ApiBuilderModel corresponding to the specified API builder
   * model definition.
   */
  public static fromConfig(
    config: ApiBuilderModelConfig,
    service: ApiBuilderService,
    namespace: string = service.namespace,
  ) {
    const fullyQualifiedName = new FullyQualifiedName(`${namespace}.models.${config.name}`);
    return new ApiBuilderModel(fullyQualifiedName, config, service);
  }

  constructor(
    fullyQualifiedName: FullyQualifiedName,
    config: ApiBuilderModelConfig,
    service: ApiBuilderService,
  ) {
    invariant(
      !fullyQualifiedName.isEnclosingType,
      `${String(fullyQualifiedName)} is the name of an enclosing type. `
      + 'You cannot create a model from an enclosing type.',
    );

    invariant(
      !fullyQualifiedName.isPrimitiveType,
      `${String(fullyQualifiedName)} is the name of a primitive type. `
      + 'You cannot create an model from a primitive type.',
    );

    this.config = config;
    this.fullyQualifiedName = fullyQualifiedName;
    this.service = service;
  }

  get fullName() {
    return this.fullyQualifiedName.fullName;
  }

  get baseTypeName() {
    return this.fullyQualifiedName.baseTypeName;
  }

  get shortName() {
    return this.fullyQualifiedName.shortName;
  }

  get packageName() {
    return this.fullyQualifiedName.packageName;
  }

  get isDeprecated() {
    return this.config.deprecation != null;
  }

  /**
   * Returns a list of unions where this type is present as a union type.
   */
  get unions(): ApiBuilderUnion[] {
    return this.service.unions.filter(
      (union) => union.types.some((unionType) => this.isSame(unionType.type)),
    );
  }

  /**
   * Returns name for the type discriminator field when this type is present
   * as a union type for one or more unions.
   */
  get discriminator() {
    const discriminators = this.unions.map(
      (union) => union.discriminator,
    ).filter((discriminator, index, self) => self.indexOf(discriminator) === index);

    if (discriminators.length > 1) {
      throw new Error('Name for the type discriminator field must be the same across all unions');
    }

    return discriminators.length ? discriminators[0] : undefined;
  }

  /**
   * Returns the string to use in the discriminator field to identify this type
   * when present as a union type for one more unions.
   */
  get discriminatorValue() {
    const discriminatorValues = this.unions.reduce<string[]>(
      (self, union) => self.concat(union.types.filter(
        (unionType) => this.isSame(unionType.type),
      ).map((unionType) => unionType.discriminatorValue)),
      // tslint:disable-next-line: align
      [],
    ).filter((value, index, self) => self.indexOf(value) === index);

    if (discriminatorValues.length > 1) {
      throw new Error('Discriminator value must the same across all union types');
    }

    return discriminatorValues.length ? discriminatorValues[0] : undefined;
  }

  get description() {
    return this.config.description;
  }

  get fields() {
    return this.config.fields.map((field) => new ApiBuilderField(field, this.service));
  }

  /**
   * Returns whether the specified type is the same as this model type.
   */
  public isSame(type: ApiBuilderType): boolean {
    return ApiBuilderModel.isInstanceOf(type) && type.fullName === this.fullName;
  }

  public toString() {
    return this.fullName;
  }

  /**
   * Returns whether the specified object is an API Builder model type.
   */
  static isInstanceOf(type: any): type is ApiBuilderModel {
    return type instanceof ApiBuilderModel;
  }
}
