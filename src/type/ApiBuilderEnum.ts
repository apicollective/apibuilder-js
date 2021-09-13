import invariant from 'invariant';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import {
  ApiBuilderEnumConfig,
  ApiBuilderType,
} from './types';
import FullyQualifiedName from '../language/FullyQualifiedName';
import ApiBuilderEnumValue from './ApiBuilderEnumValue';
import ApiBuilderUnion from './ApiBuilderUnion';
import type ApiBuilderService from './ApiBuilderService';

/**
 * An object representing an API builder enum definition.
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-enum
 */
export default class ApiBuilderEnum {
  private config: ApiBuilderEnumConfig;

  private fullyQualifiedName: FullyQualifiedName;

  private service: ApiBuilderService;

  /**
   * Returns the ApiBuilderEnum corresponding to the specified enum definition.
   */
  public static fromConfig(
    config: ApiBuilderEnumConfig,
    service: ApiBuilderService,
    namespace: string = service.namespace,
  ) {
    const fullyQualifiedName = new FullyQualifiedName(`${namespace}.enums.${config.name}`);
    return new ApiBuilderEnum(fullyQualifiedName, config, service);
  }

  constructor(
    fullyQualifiedName: FullyQualifiedName,
    config: ApiBuilderEnumConfig,
    service: ApiBuilderService,
  ) {
    invariant(
      !fullyQualifiedName.isEnclosingType,
      `${String(fullyQualifiedName)} is the name of a collection type. `
      + 'You cannot create an enumeration from a collection type.',
    );

    invariant(
      !fullyQualifiedName.isPrimitiveType,
      `${String(fullyQualifiedName)} is the name of a primitive type. `
      + 'You cannot create an enumeration from a primitive type.',
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

  get name() {
    return this.config.name;
  }

  /**
   * A string used to identify this enumeration. Useful for naming the variable
   * corresponding to this enumeration in code generators.
   */
  get nickname() {
    return upperFirst(camelCase(this.name));
  }

  get plural() {
    return this.config.plural;
  }

  get description() {
    return this.config.description;
  }

  get values() {
    return this.config.values.map((value) => new ApiBuilderEnumValue(value));
  }

  get attributes() {
    return this.config.attributes;
  }

  get isDeprecated() {
    return this.config.deprecation != null;
  }

  get deprecationReason() {
    if (this.config.deprecation != null) {
      return this.config.deprecation.description;
    }

    return undefined;
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
    const discriminators = this.unions.map((union) => union.discriminator)
      .filter((discriminator, index, self) => self.indexOf(discriminator) === index);

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
      (self, union) => self.concat(
        union.types.filter(
          (unionType) => this.isSame(unionType.type),
        ).map((unionType) => unionType.discriminatorValue),
      ),
      // tslint:disable-next-line: align
      [],
    ).filter((value, index, self) => self.indexOf(value) === index);

    if (discriminatorValues.length > 1) {
      throw new Error('Discriminator value must the same across all union types');
    }

    return discriminatorValues.length ? discriminatorValues[0] : undefined;
  }

  public isSame(type: ApiBuilderType): boolean {
    return ApiBuilderEnum.isInstanceOf(type) && type.fullName === this.fullName;
  }

  public toString() {
    return this.fullName;
  }

  static isInstanceOf(type: any): type is ApiBuilderEnum {
    return type instanceof ApiBuilderEnum;
  }
}
