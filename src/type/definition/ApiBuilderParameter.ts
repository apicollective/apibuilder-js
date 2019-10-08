import { Parameter } from '../../generated/types/apibuilder-spec';
import { ApiBuilderService } from './ApiBuilderService';
import { astFromTypeName, typeFromAst } from '../../language';

export class ApiBuilderParameter {
  private config: Parameter;
  private service: ApiBuilderService;

  constructor(config: Parameter, service: ApiBuilderService) {
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
