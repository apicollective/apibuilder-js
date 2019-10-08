import { Response } from '../../generated/types/apibuilder-spec';
import { typeFromAst, astFromTypeName } from '../../language';
import { ApiBuilderService } from './ApiBuilderService';

export class ApiBuilderResponse {
  private config: Response;
  private service: ApiBuilderService;

  constructor(config: Response, service: ApiBuilderService) {
    this.config = config;
    this.service = service;
  }

  get code() {
    switch (this.config.code.discriminator) {
      case 'integer':
        return this.config.code.value;
      default:
        return undefined;
    }
  }

  /**
   * Indicates this is the default response object for all HTTP codes that are
   * not covered individually by the specification.
   */
  get isDefault() {
    switch (this.config.code.discriminator) {
      case 'integer':
        return false;
      default:
        return this.config.code.value === 'Default';
    }
  }

  get type() {
    return typeFromAst(astFromTypeName(this.config.type || 'unit'), this.service);
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
  }

  get attributes() {
    return this.config.attributes;
  }
}
