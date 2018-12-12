import { ApiBuilderDeprecationConfig } from './ApiBuilderDeprecation';
import { ApiBuilderHeaderConfig } from './ApiBuilderHeader';

/**
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#enum-response_code_option
 */
export enum ApiBuilderResponseCodeOption {
  DEFAULT = 'Default',
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
