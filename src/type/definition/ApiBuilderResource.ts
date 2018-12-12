import { ApiBuilderAttributeConfig } from './ApiBuilderAttribute';
import { ApiBuilderDeprecationConfig } from './ApiBuilderDeprecation';
import { ApiBuilderOperation, ApiBuilderOperationConfig } from './ApiBuilderOperation';
import { ApiBuilderService } from './ApiBuilderService';
import { astFromTypeName, typeFromAst } from '../../language';

/**
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/0.11.94#model-resource
 */
export interface ApiBuilderResourceConfig {
  readonly type: string;
  readonly plural: string;
  readonly path?: string;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly operations: ReadonlyArray<ApiBuilderOperationConfig>;
  readonly attributes: ReadonlyArray<ApiBuilderAttributeConfig>;
}

export class ApiBuilderResource {
  private config: ApiBuilderResourceConfig;
  private service: ApiBuilderService;

  constructor(config: ApiBuilderResourceConfig, service: ApiBuilderService) {
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
