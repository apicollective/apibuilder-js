import invariant from 'invariant';
import { camelCase, map, upperFirst } from 'lodash';
import { FullyQualifiedName } from '../../language';
import { ApiBuilderAttributeConfig } from './ApiBuilderAttribute';
import { ApiBuilderDeprecationConfig } from './ApiBuilderDeprecation';
import { ApiBuilderEnumValue, ApiBuilderEnumValueConfig } from './ApiBuilderEnumValue';
import { ApiBuilderService } from './ApiBuilderService';

export interface ApiBuilderEnumConfig {
  readonly name: string;
  readonly plural: string;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly values: ReadonlyArray<ApiBuilderEnumValueConfig>;
  readonly attributes: ReadonlyArray<ApiBuilderAttributeConfig>;
}

/**
 * An object representing an API builder enum definition.
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-enum
 */
export class ApiBuilderEnum {
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
      `${String(fullyQualifiedName)} is the name of a collection type. ` +
      'You cannot create an enumeration from a collection type.',
    );

    invariant(
      !fullyQualifiedName.isPrimitiveType,
      `${String(fullyQualifiedName)} is the name of a primitive type. ` +
      'You cannot create an enumeration from a primitive type.',
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
    return map(this.config.values, value => new ApiBuilderEnumValue(value));
  }

  get attributes() {
    return this.config.attributes;
  }

  get isDeprecated() {
    return this.config.deprecation != null;
  }

  get deprecationReason() {
    if (this.config.deprecation) {
      return this.config.deprecation.description;
    }
  }
}
