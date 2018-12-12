import { ApiBuilderAttributeConfig } from './ApiBuilderAttribute';
import { ApiBuilderDeprecationConfig } from './ApiBuilderDeprecation';

/**
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-body
 */
export interface ApiBuilderBodyConfig {
  readonly type: string;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly attributes: ReadonlyArray<ApiBuilderAttributeConfig>;
}
