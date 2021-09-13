import { ApiBuilderResourceConfig } from './types';
import { typeFromAst } from '../language';
import { astFromTypeName } from '../language/ast';
import ApiBuilderOperation from './ApiBuilderOperation';
import type ApiBuilderService from './ApiBuilderService';

export default class ApiBuilderResource {
  private config: ApiBuilderResourceConfig;

  private service: ApiBuilderService;

  constructor(config: ApiBuilderResourceConfig, service: ApiBuilderService) {
    this.config = config;
    this.service = service;
  }

  get operations() {
    return this.config.operations.map((
      (operation) => new ApiBuilderOperation(operation, this, this.service)
    ));
  }

  get type() {
    return typeFromAst(astFromTypeName(this.config.type), this.service);
  }

  get typeName() {
    return this.config.type;
  }

  get plural() {
    return this.config.plural;
  }

  get namespace() {
    return this.service.namespace;
  }

  get path() {
    return this.config.path;
  }
}
