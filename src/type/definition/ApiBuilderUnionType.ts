
import { ApiBuilderService } from './ApiBuilderService';
import { UnionType } from '../../generated/types/apibuilder-spec';
import { astFromTypeName, typeFromAst } from '../../language';

export class ApiBuilderUnionType {
  private config: UnionType;
  private service: ApiBuilderService;

  constructor(config: UnionType, service: ApiBuilderService) {
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
