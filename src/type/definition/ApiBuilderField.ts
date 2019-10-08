import { ApiBuilderService } from './ApiBuilderService';
import { Field } from '../../generated/types/apibuilder-spec';
import { astFromTypeName, typeFromAst } from '../../language';

export class ApiBuilderField {
  private config: Field;
  private service: ApiBuilderService;

  constructor(config: Field, service: ApiBuilderService) {
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
