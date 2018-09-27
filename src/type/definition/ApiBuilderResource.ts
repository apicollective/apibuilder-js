import { ApiBuilderAttributeConfig } from './ApiBuilderAttribute';
import { ApiBuilderDeprecationConfig } from './ApiBuilderDeprecation';
import { ApiBuilderOperation, ApiBuilderOperationConfig } from './ApiBuilderOperation';
import { ApiBuilderService } from './ApiBuilderService';
import { astFromTypeName, typeFromAst } from '../../language';

/**
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#enum-method
 */
export enum ApiBuilderMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  CONNECT = 'CONNECT',
  OPTIONS = 'OPTIONS',
  TRACE = 'TRACE',
}

/**
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#enum-response_code_option
 */
export enum ApiBuilderResponseCodeOption {
  DEFAULT = 'Default',
}

/**
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-body
 */
export interface ApiBuilderBodyConfig {
  readonly type: string;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly attributes: ReadonlyArray<ApiBuilderAttributeConfig>;
}

/**
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-header
 */
export interface ApiBuilderHeaderConfig {
  readonly name: string;
  readonly type: string;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly required: boolean;
  readonly default?: string;
  readonly attributes: ReadonlyArray<ApiBuilderAttributeConfig>;
}

interface IntegerValueType {
  readonly value: number;
}

interface IntegerType {
  readonly integer: IntegerValueType;
}

interface ApiBuilderResponseCodeOptionType {
  readonly response_code_option: ApiBuilderResponseCodeOption;
}

/**
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#union-response_code
 */
export type ApiBuilderResponseCode = IntegerType | ApiBuilderResponseCodeOptionType;

/**
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-response
 */
export interface ApiBuilderResponseConfig {
  readonly code: ApiBuilderResponseCode;
  readonly type: string;
  readonly headers?: ReadonlyArray<ApiBuilderHeaderConfig>;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
}

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
