import invariant from 'invariant';
import { ApiBuilderAttributeConfig } from './ApiBuilderAttribute';
import { ApiBuilderDeprecationConfig } from './ApiBuilderDeprecation';
import { ApiBuilderService } from './ApiBuilderService';
import { ApiBuilderField, ApiBuilderFieldConfig } from './ApiBuilderField';
import { FullyQualifiedName } from '../../language';

export interface ApiBuilderModelConfig {
  readonly name: string;
  readonly plural: string;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly fields: ReadonlyArray<ApiBuilderFieldConfig>;
  readonly attributes: ReadonlyArray<ApiBuilderAttributeConfig>;
}

export class ApiBuilderModel {
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
      `${String(fullyQualifiedName)} is the name of an enclosing type. ` +
      'You cannot create a model from an enclosing type.',
    );

    invariant(
      !fullyQualifiedName.isPrimitiveType,
      `${String(fullyQualifiedName)} is the name of a primitive type. ` +
      'You cannot create an model from a primitive type.',
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

  get description() {
    return this.config.description;
  }

  get fields() {
    return this.config.fields.map(field => new ApiBuilderField(field, this.service));
  }

  public toString() {
    return this.fullName;
  }
}
