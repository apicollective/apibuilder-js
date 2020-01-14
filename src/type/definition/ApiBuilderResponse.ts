import { ApiBuilderDeprecationConfig } from './ApiBuilderDeprecation';
import { ApiBuilderHeaderConfig } from './ApiBuilderHeader';
import { ApiBuilderAttributeConfig } from './ApiBuilderAttribute';
import { typeFromAst, astFromTypeName } from '../../language';
import { ApiBuilderService } from './ApiBuilderService';

/**
 * https://github.com/Microsoft/TypeScript/issues/20863#issuecomment-479471546
 */
type Compute<A> = {
  [K in keyof A]: A[K]
} extends infer X ? X : never;

type UnionKeys<T> = T extends unknown ? keyof T : never;

type StrictUnionHelper<T, A> = T extends unknown
  ? T & Partial<Record<Exclude<UnionKeys<A>, keyof T>, never>>
  : never;

type StrictUnion<T> = Compute<StrictUnionHelper<T, T>>;

interface PrimitiveUnionType<T> {
  value: T;
}

/**
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#enum-response_code_option
 */
export type ApiBuilderResponseCodeOption = 'Default';

/**
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#union-response_code
 */
export type ApiBuilderResponseCode = StrictUnion<
  | { integer: PrimitiveUnionType<number>; }
  | { response_code_option: ApiBuilderResponseCodeOption; }
  | { discriminator: 'integer', value: number }
  | { discriminator: 'response_code_option', value: ApiBuilderResponseCodeOption }
>;

/**
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-response
 */
export interface ApiBuilderResponseConfig {
  readonly code: ApiBuilderResponseCode;
  readonly type: string;
  readonly headers?: ReadonlyArray<ApiBuilderHeaderConfig>;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly attributes?: ReadonlyArray<ApiBuilderAttributeConfig>;
}

export class ApiBuilderResponse {
  private config: ApiBuilderResponseConfig;
  private service: ApiBuilderService;

  constructor(config: ApiBuilderResponseConfig, service: ApiBuilderService) {
    this.config = config;
    this.service = service;
  }

  get code() {
    if (this.config.code.integer != null) {
      return this.config.code.integer.value;
    }

    if (this.config.code.discriminator === 'integer') {
      return this.config.code.value;
    }
  }

  /**
   * Indicates this is the default response object for all HTTP codes that are
   * not covered individually by the specification.
   */
  get isDefault() {
    if (this.config.code.response_code_option != null) {
      return this.config.code.response_code_option === 'Default';
    }

    if (this.config.code.discriminator === 'response_code_option') {
      return this.config.code.value === 'Default';
    }

    return false;
  }

  get type() {
    const typeName = this.config.type != null ? this.config.type : 'unit';
    return typeFromAst(astFromTypeName(typeName), this.service);
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
