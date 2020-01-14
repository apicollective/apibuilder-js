import { ApiBuilderDeprecationConfig } from './ApiBuilderDeprecation';
import { ApiBuilderService } from './ApiBuilderService';
import { astFromTypeName, typeFromAst } from '../../language';
import { ApiBuilderAttributeConfig } from './ApiBuilderAttribute';

/**
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#enum-parameter_location
 */
export type ApiBuilderParameterLocation = 'Path' | 'Query' | 'Form' | 'Header';

/**
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-parameter
 */
export interface ApiBuilderParameterConfig {
  readonly name: string;
  readonly type: string;
  readonly location: ApiBuilderParameterLocation;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly required: boolean;
  readonly default?: string;
  readonly minimum?: number;
  readonly maximum?: number;
  readonly example?: string;
  readonly attributes?: ApiBuilderAttributeConfig[];
}

export class ApiBuilderParameter {
  private config: ApiBuilderParameterConfig;
  private service: ApiBuilderService;

  constructor(config: ApiBuilderParameterConfig, service: ApiBuilderService) {
    this.config = config;
    this.service = service;
  }

  get name() {
    return this.config.name;
  }

  get type() {
    return typeFromAst(astFromTypeName(this.config.type), this.service);
  }

  get defaultValue() {
    return this.config.default;
  }

  get deprecation() {
    return this.config.deprecation;
  }

  get description() {
    return this.config.description;
  }

  get location() {
    return this.config.location;
  }

  get isRequired() {
    return this.config.required;
  }
}
