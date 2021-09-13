import { typeFromAst } from '../language';
import { astFromTypeName } from '../language/ast';
import type ApiBuilderService from './ApiBuilderService';
import type { ApiBuilderParameterConfig } from './types';

export default class ApiBuilderParameter {
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
