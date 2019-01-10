import { ApiBuilderDeprecationConfig } from './ApiBuilderDeprecation';

export interface ApiBuilderAnnotationConfig {
  readonly name: string;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
}
