import { ApiBuilderContactConfig } from './ApiBuilderContact';
import { ApiBuilderLicenseConfig } from './ApiBuilderLicense';

/**
 * General metadata about this service
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-info
 */
export interface ApiBuilderInfoConfig {
  readonly license?: ApiBuilderLicenseConfig;
  readonly contact?: ApiBuilderContactConfig;
}
