import { typeFromAst } from '../language';
import { astFromTypeName } from '../language/ast';
import type { ApiBuilderUnionTypeConfig } from './types';
import type ApiBuilderService from './ApiBuilderService';

/**
 * An object representing an API builder union definition
 * * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-union
 */
export default class ApiBuilderUnionType {
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
