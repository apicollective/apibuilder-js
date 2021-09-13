import { typeFromAst } from '../language';
import { astFromTypeName } from '../language/ast';
import type { ApiBuilderResponseConfig } from './types';
import type ApiBuilderService from './ApiBuilderService';

export default class ApiBuilderResponse {
  private config: ApiBuilderResponseConfig;

  private service: ApiBuilderService;

  constructor(config: ApiBuilderResponseConfig, service: ApiBuilderService) {
    this.config = config;
    this.service = service;
  }

  get code() {
    if (this.config.code.integer != null) {
      return this.config.code.integer.value;
    }

    if (this.config.code.discriminator === 'integer') {
      return this.config.code.value;
    }

    return undefined;
  }

  /**
   * Indicates this is the default response object for all HTTP codes that are
   * not covered individually by the specification.
   */
  get isDefault() {
    if (this.config.code.response_code_option != null) {
      return this.config.code.response_code_option === 'Default';
    }

    if (this.config.code.discriminator === 'response_code_option') {
      return this.config.code.value === 'Default';
    }

    return false;
  }

  get type() {
    const typeName = this.config.type != null ? this.config.type : 'unit';
    return typeFromAst(astFromTypeName(typeName), this.service);
  }

  get headers() {
    return this.config.headers;
  }

  get description() {
    return this.config.description;
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

  get attributes() {
    return this.config.attributes;
  }
}
