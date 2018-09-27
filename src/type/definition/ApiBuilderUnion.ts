import { map } from 'lodash';
import invariant from 'invariant';

import { ApiBuilderAttributeConfig } from './ApiBuilderAttribute';
import { ApiBuilderDeprecationConfig } from './ApiBuilderDeprecation';
import { ApiBuilderService } from './ApiBuilderService';
import { ApiBuilderUnionType, ApiBuilderUnionTypeConfig } from './ApiBuilderUnionType';
import { FullyQualifiedName } from '../../language';

export interface ApiBuilderUnionConfig {
  readonly name: string;
  readonly plural: string;
  readonly discriminator?: string;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly types: ReadonlyArray<ApiBuilderUnionTypeConfig>;
  readonly attributes: ReadonlyArray<ApiBuilderAttributeConfig>;
}

export class ApiBuilderUnion {
  private config: ApiBuilderUnionConfig;
  private fullyQualifiedName: FullyQualifiedName;
  private service: ApiBuilderService;

  /**
   * Returns the ApiBuilderUnion corresponding to the specified API Builder
   * union definition.
   */
  public static fromConfig(
    config: ApiBuilderUnionConfig,
    service: ApiBuilderService,
    namespace = service.namespace,
  ) {
    const fullyQualifiedName = new FullyQualifiedName(`${namespace}.unions.${config.name}`);
    return new ApiBuilderUnion(fullyQualifiedName, config, service);
  }

  constructor(
    fullyQualifiedName: FullyQualifiedName,
    config: ApiBuilderUnionConfig,
    service: ApiBuilderService,
  ) {
    invariant(
      !fullyQualifiedName.isEnclosingType,
      `${String(fullyQualifiedName)} is a collection type. ` +
      'You cannot create an union from a collection type.',
    );

    invariant(
      !fullyQualifiedName.isPrimitiveType,
      `${String(fullyQualifiedName)} is a primitive type. ` +
      'You cannot create an union from a primitive type.',
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

  get plural() {
    return this.config.plural;
  }

  get discriminator() {
    return this.config.discriminator;
  }

  get description() {
    return this.config.description;
  }

  get deprecation() {
    return this.config.deprecation;
  }

  get types() {
    return map(this.config.types, (
      type => new ApiBuilderUnionType(type, this.service)
    ));
  }

  get attributes() {
    return this.config.attributes;
  }

  public toString() {
    return this.fullName;
  }
}
