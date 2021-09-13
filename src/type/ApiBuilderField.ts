import { typeFromAst } from '../language';
import { astFromTypeName } from '../language/ast';
import type { ApiBuilderFieldConfig } from './types';
import type ApiBuilderService from './ApiBuilderService';

export default class ApiBuilderField {
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
    if (this.config.deprecation != null) {
      return this.config.deprecation.description;
    }

    return undefined;
  }

  public toString() {
    return this.name;
  }
}
