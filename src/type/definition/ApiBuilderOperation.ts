import { flow, get, getOr, inRange } from 'lodash/fp';
import { ApiBuilderAttributeConfig } from './ApiBuilderAttribute';
import { ApiBuilderBodyConfig } from './ApiBuilderBody';
import { ApiBuilderDeprecationConfig } from './ApiBuilderDeprecation';
import { ApiBuilderParameter, ApiBuilderParameterConfig } from './ApiBuilderParameter';
import { ApiBuilderResource } from './ApiBuilderResource';
import { ApiBuilderResponseConfig } from './ApiBuilderResponse';
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

export interface ApiBuilderOperationConfig {
  readonly method: ApiBuilderMethod;
  readonly path: string;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly body?: ApiBuilderBodyConfig;
  readonly parameters: ReadonlyArray<ApiBuilderParameterConfig>;
  readonly responses: ReadonlyArray<ApiBuilderResponseConfig>;
  readonly attributes: ReadonlyArray<ApiBuilderAttributeConfig>;
}

export class ApiBuilderOperation {
  private config: ApiBuilderOperationConfig;
  private resource: ApiBuilderResource;
  private service: ApiBuilderService;

  constructor(
    config: ApiBuilderOperationConfig,
    resource: ApiBuilderResource,
    service: ApiBuilderService,
  ) {
    this.config = config;
    this.service = service;
    this.resource = resource;
  }

  get method() {
    return this.config.method;
  }

  get isDeprecated() {
    return this.config.deprecation != null;
  }

  get deprecationReason() {
    if (this.config.deprecation) {
      return this.config.deprecation.description;
    }
  }

  get description() {
    return this.config.description;
  }

  /**
   * A string used to identify this operation. Useful for naming the method
   * corresponding to this operation in code generators.
   */
  get nickname() {
    throw new Error('Not Implemented');
  }

  get url() {
    return `${this.service.baseUrl}${this.resource.path}${this.path}`;
  }

  get path() {
    if (this.resource.path && this.config.path.startsWith(this.resource.path)) {
      return this.config.path.substring(this.resource.path.length);
    }

    return this.config.path;
  }

  get resultType() {
    const type = getOr(
      'unit',
      'type',
      this.config.responses.find(flow(
        get('code.integer.value'),
        inRange(200, 300),
      )),
    );

    return typeFromAst(astFromTypeName(type), this.service);
  }

  get parameters() {
    return this.config.parameters.map((
      parameter => new ApiBuilderParameter(parameter, this.service)
    ));
  }
}
