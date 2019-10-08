import { Resource } from '../../generated/types/apibuilder-spec';
import { ApiBuilderOperation } from './ApiBuilderOperation';
import { ApiBuilderService } from './ApiBuilderService';
import { astFromTypeName, typeFromAst } from '../../language';

export class ApiBuilderResource {
  private config: Resource;
  private service: ApiBuilderService;

  constructor(config: Resource, service: ApiBuilderService) {
    this.config = config;
    this.service = service;
  }

  get operations() {
    return this.config.operations.map((
      operation => new ApiBuilderOperation(operation, this, this.service)
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
