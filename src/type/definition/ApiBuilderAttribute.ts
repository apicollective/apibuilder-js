import { ApiBuilderDeprecationConfig } from './ApiBuilderDeprecation';

/**
 * Represents an additional attribute that is attached to an object.
 * The main use case is to capture additional metadata that doesn’t necessarily
 * define the API but aids in code generation. Examples would be hints for
 * certain code generators about classes to extend, interfaces to implement,
 * annotations to add, names to assign to certain methods, etc. The specific
 * attributes will be applicable only in the context of the specific code
 * generators usings them.
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/0.11.94#model-attribute
 */
export interface ApiBuilderAttributeConfig {
  readonly name: string;
  readonly value: object;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
}
