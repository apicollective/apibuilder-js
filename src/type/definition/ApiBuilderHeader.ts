import { ApiBuilderAttributeConfig } from './ApiBuilderAttribute';
import { ApiBuilderDeprecationConfig } from './ApiBuilderDeprecation';

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
