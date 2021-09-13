import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import ApiBuilderBody from './ApiBuilderBody';
import ApiBuilderParameter from './ApiBuilderParameter';
import type ApiBuilderResource from './ApiBuilderResource';
import ApiBuilderResponse from './ApiBuilderResponse';
import type ApiBuilderService from './ApiBuilderService';
import type {
  ApiBuilderOperationConfig,
} from './types';

function pascalCase(string: string) {
  return upperFirst(camelCase(string));
}

export default class ApiBuilderOperation {
  private config: ApiBuilderOperationConfig;

  public resource: ApiBuilderResource;

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

  get body() {
    if (this.config.body != null) {
      return new ApiBuilderBody(this.config.body, this.service);
    }

    return undefined;
  }

  get method() {
    return this.config.method;
  }

  get isDeprecated() {
    return this.config.deprecation != null;
  }

  get deprecationReason() {
    if (this.config.deprecation != null) {
      return this.config.deprecation.description;
    }

    return undefined;
  }

  get description() {
    return this.config.description;
  }

  /**
   * A string used to identify this operation. Useful for naming the method
   * corresponding to this operation in code generators.
   */
  get nickname() {
    let { path } = this.config;

    if (this.resource.path != null) {
      path = path.replace(this.resource.path, '');
    }

    if (path.startsWith('/')) {
      path = path.slice(1);
    }

    const parts = path.split('/');

    const dynamicParts = parts.filter((part) => part.startsWith(':')).map((part, index) => {
      const prefix = index === 0 ? 'By' : 'And';
      return prefix + pascalCase(part);
    });

    const staticParts = parts.filter((part) => !part.startsWith(':')).map((part, index) => {
      const prefix = index === 0 ? '' : 'And';
      return prefix + pascalCase(part);
    });

    return this.method.toLowerCase() + staticParts.concat(dynamicParts).join('');
  }

  get url() {
    return `${this.service.baseUrl}${this.config.path}`;
  }

  get path() {
    return this.config.path;
  }

  get parameters() {
    return this.config.parameters.map((
      (parameter) => new ApiBuilderParameter(parameter, this.service)
    ));
  }

  get responses() {
    return this.config.responses.map((response) => new ApiBuilderResponse(response, this.service));
  }

  /**
   * Returns the response object matching the specified response code.
   * @param responseCode
   * @param useDefault
   * Indicates whether to fallback to the default response object for all
   * HTTP codes that are not covered individually by the specification.
   */
  getResponseByCode(responseCode: number, useDefault: boolean = false) {
    const response = this.responses.find((resp) => resp.code === responseCode);

    if (response != null) {
      return response;
    }

    if (useDefault) {
      return this.responses.find((resp) => resp.isDefault);
    }

    return undefined;
  }

  /**
   * Returns the type for the response matching the specified response code.
   * @param responseCode
   * @param useDefault
   * Indicates whether to fallback to the default response object for all
   * HTTP codes that are not covered individually by the specification.
   */
  getResponseTypeByCode(responseCode: number, useDefault?: boolean) {
    const response = this.getResponseByCode(responseCode, useDefault);
    return response != null ? response.type : undefined;
  }
}
