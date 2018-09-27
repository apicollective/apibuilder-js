import { ApiBuilderAttributeConfig } from './ApiBuilderAttribute';
import { ApiBuilderDeprecationConfig } from './ApiBuilderDeprecation';
import { ApiBuilderService } from './ApiBuilderService';
import { astFromTypeName, typeFromAst } from '../../language';

export interface ApiBuilderFieldConfig {
  readonly name: string;
  readonly type: string;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly default?: string;
  readonly required: boolean;
  readonly minimum?: number;
  readonly maximum?: number;
  readonly example?: string;
  readonly attributes: ReadonlyArray<ApiBuilderAttributeConfig>;
  readonly annotations?: ReadonlyArray<string>;
}

export class ApiBuilderField {
  private config: ApiBuilderFieldConfig;
  private service: ApiBuilderService;

  constructor(config: ApiBuilderFieldConfig, service: ApiBuilderService) {
    this.config = config;
    this.service = service;
  }

  get name() {
    return this.config.name;
  }

  get type() {
    return typeFromAst(astFromTypeName(this.config.type), this.service);
  }

  get description() {
    return this.config.description;
  }

  get isRequired() {
    return this.config.required;
  }

  get default() {
    return this.config.default;
  }

  get example() {
    return this.config.example;
  }

  get minimum() {
    return this.config.minimum;
  }

  get maximum() {
    return this.config.maximum;
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

  public toString() {
    return this.name;
  }
}
