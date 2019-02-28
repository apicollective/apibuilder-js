import { ApiBuilderDeprecationConfig } from './ApiBuilderDeprecation';
import { ApiBuilderHeaderConfig } from './ApiBuilderHeader';
import { ApiBuilderAttributeConfig } from './ApiBuilderAttribute';
import { typeFromAst, astFromTypeName } from '../../language';
import { ApiBuilderService } from './ApiBuilderService';

/**
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#enum-response_code_option
 */
export enum ApiBuilderResponseCodeOption {
  DEFAULT = 'Default',
}

interface IntegerValueType {
  readonly value: number;
}

export interface ApiBuilderResponseCodeIntegerType {
  readonly integer: IntegerValueType;
}

export interface ApiBuilderResponseCodeOptionType {
  readonly response_code_option: ApiBuilderResponseCodeOption;
}

/**
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#union-response_code
 */
export type ApiBuilderResponseCode = ApiBuilderResponseCodeIntegerType | ApiBuilderResponseCodeOptionType;

/**
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-response
 */
export interface ApiBuilderResponseConfig {
  readonly code: ApiBuilderResponseCode;
  readonly type: string;
  readonly headers?: ReadonlyArray<ApiBuilderHeaderConfig>;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly attributes: ReadonlyArray<ApiBuilderAttributeConfig>;
}

export class ApiBuilderResponse {
  private config: ApiBuilderResponseConfig;
  private service: ApiBuilderService;

  constructor(config: ApiBuilderResponseConfig, service: ApiBuilderService) {
    this.config = config;
    this.service = service;
  }

  get code() {
    if ((<ApiBuilderResponseCodeIntegerType>this.config.code).integer) {
      return (<ApiBuilderResponseCodeIntegerType>this.config.code).integer.value;
    }
  }

  /**
   * Indicates this is the default response object for all HTTP codes that are not covered
   * individually by the specification.
   */
  get isDefault() {
    if ((<ApiBuilderResponseCodeOptionType>this.config.code).response_code_option) {
      // tslint:disable-next-line max-line-length
      return (<ApiBuilderResponseCodeOptionType>this.config.code).response_code_option === ApiBuilderResponseCodeOption.DEFAULT;
    }

    return false;
  }

  get type() {
    return typeFromAst(astFromTypeName(this.config.type || 'unit'), this.service);
  }

  get headers() {
    return this.config.headers;
  }

  get description() {
    return this.config.description;
  }

  get isDeprecated() {
    return this.config.deprecation != null;
  }

  get deprecationReason() {
    if (this.config.deprecation != null) {
      return this.config.deprecation.description;
    }
  }

  get attributes() {
    return this.config.attributes;
  }
}
