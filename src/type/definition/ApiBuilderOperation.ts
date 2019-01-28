import { flow, get, getOr, inRange } from 'lodash/fp';
import { ApiBuilderAttributeConfig } from './ApiBuilderAttribute';
import { ApiBuilderBodyConfig } from './ApiBuilderBody';
import { ApiBuilderDeprecationConfig } from './ApiBuilderDeprecation';
import { ApiBuilderParameter, ApiBuilderParameterConfig } from './ApiBuilderParameter';
import { ApiBuilderResource } from './ApiBuilderResource';
import { ApiBuilderResponseConfig, ApiBuilderResponseCodeIntegerType, ApiBuilderResponse } from './ApiBuilderResponse';
import { ApiBuilderService } from './ApiBuilderService';

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
  readonly method: ApiBuilderMethod | keyof typeof ApiBuilderMethod;
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
    return `${this.service.baseUrl}${this.config.path}`;
  }

  get path() {
    return this.config.path;
  }

  get parameters() {
    return this.config.parameters.map((
      parameter => new ApiBuilderParameter(parameter, this.service)
    ));
  }

  get responses() {
    return this.config.responses.map((response) => {
      return new ApiBuilderResponse(response, this.service);
    });
  }

  /**
   * Returns the type for the response matching the specified response code.
   * @param responseCode {number}
   * @param useDefault {boolean}
   * Indicates whether to fallback to the default response object for all
   * HTTP codes that are not covered individually by the specification.
   */
  getResponseTypeByCode(responseCode: number, useDefault: boolean = false) {
    let response = this.responses.find(response => response.code === responseCode);

    if (useDefault && response == null) {
      response = this.responses.find(response => response.isDefault);
    }

    if (response != null) {
      return response.type;
    }
  }
}
