import { ApiBuilderAttributeConfig } from './ApiBuilderAttribute';
import { ApiBuilderDeprecationConfig } from './ApiBuilderDeprecation';
import { ApiBuilderService } from './ApiBuilderService';
import { astFromTypeName, typeFromAst } from '../../language';

/**
 * An object representing an API builder union type definition.
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-union_type
 */
export interface ApiBuilderUnionTypeConfig {
  readonly type: string;
  readonly description?: string;
  readonly attributes: ReadonlyArray<ApiBuilderAttributeConfig>;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly default?: boolean;
  readonly discriminator_value?: string;
}

/**
 * An object representing an API builder union definition
 * * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-union
 */
export class ApiBuilderUnionType {
  private config: ApiBuilderUnionTypeConfig;
  private service: ApiBuilderService;

  constructor(config: ApiBuilderUnionTypeConfig, service: ApiBuilderService) {
    this.config = config;
    this.service = service;
  }

  get type() {
    return typeFromAst(astFromTypeName(this.config.type), this.service);
  }

  get typeName() {
    return this.config.type;
  }

  get description() {
    return this.config.description;
  }

  get deprecation() {
    return this.config.deprecation;
  }

  get attributes() {
    return this.config.attributes;
  }

  get default() {
    return this.config.default;
  }

  get discriminatorValue() {
    return this.config.discriminator_value || this.config.type;
  }

  public toString() {
    return this.config.type;
  }
}
