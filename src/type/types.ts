import type ApiBuilderArray from './ApiBuilderArray';
import type ApiBuilderMap from './ApiBuilderMap';
import type ApiBuilderPrimitiveType from './ApiBuilderPrimitiveType';
import type ApiBuilderModel from './ApiBuilderModel';
import type ApiBuilderEnum from './ApiBuilderEnum';
import type ApiBuilderUnion from './ApiBuilderUnion';

/**
 * Workaround for union without discriminant properties
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

export interface ApiBuilderAnnotationConfig {
  readonly name: string;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
}

export interface ApiBuilderApiDocConfig {
  readonly version: string;
}

export interface ApiBuilderApplicationConfig {
  readonly key: string;
}

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
  readonly value: Record<string, string>;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
}

/**
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-body
 */
export interface ApiBuilderBodyConfig {
  readonly type: string;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly attributes: ReadonlyArray<ApiBuilderAttributeConfig>;
}

/**
 * Describes the primary contact for this service
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-contact
 */
export interface ApiBuilderContactConfig {
  readonly name?: string;
  readonly url?: string;
  readonly email?: string;
}

/**
 * Indicates that this particular element is considered deprecated in the API.
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/0.11.94#model-deprecation
 */
export interface ApiBuilderDeprecationConfig {
  readonly description?: string;
}

export interface ApiBuilderEnumConfig {
  readonly name: string;
  readonly plural: string;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly values: ReadonlyArray<ApiBuilderEnumValueConfig>;
  readonly attributes: ReadonlyArray<ApiBuilderAttributeConfig>;
}

export interface ApiBuilderEnumValueConfig {
  readonly name: string;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly attributes?: ReadonlyArray<ApiBuilderAttributeConfig>;
  readonly value?: string;
}

export interface ApiBuilderFieldConfig {
  readonly name: string;
  readonly type: string;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly default?: string;
  readonly required: boolean;
  readonly minimum?: number;
  readonly maximum?: number;
  readonly example?: string;
  readonly attributes: ReadonlyArray<ApiBuilderAttributeConfig>;
  readonly annotations?: ReadonlyArray<string>;
}

export type ApiBuilderFileFlag = 'scaffolding';

export interface ApiBuilderFileConfig {
  readonly name: string;
  readonly dir: string;
  readonly contents: string;
  readonly flags?: ApiBuilderFileFlag;
}

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

export interface ApiBuilderImportConfig {
  readonly uri: string;
  readonly namespace: string;
  readonly organization: ApiBuilderOrganizationConfig;
  readonly application: ApiBuilderApplicationConfig;
  readonly version: string;
  readonly enums: string[];
  readonly unions: string[];
  readonly models: string[];
  readonly annotations?: ApiBuilderAnnotationConfig[];
}

/**
 * General metadata about this service
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-info
 */
export interface ApiBuilderInfoConfig {
  readonly license?: ApiBuilderLicenseConfig;
  readonly contact?: ApiBuilderContactConfig;
}

/**
 * Describes the software license contact for this service
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-license
 */
export interface ApiBuilderLicenseConfig {
  readonly name: string;
  readonly url?: string;
}

export interface ApiBuilderModelConfig {
  readonly name: string;
  readonly plural: string;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly fields: ReadonlyArray<ApiBuilderFieldConfig>;
  readonly attributes: ReadonlyArray<ApiBuilderAttributeConfig>;
}

/**
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#enum-method
 */
export type ApiBuilderMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'CONNECT'
  | 'OPTIONS'
  | 'TRACE';

export interface ApiBuilderOperationConfig {
  readonly method: ApiBuilderMethod;
  readonly path: string;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly body?: ApiBuilderBodyConfig;
  readonly parameters: ReadonlyArray<ApiBuilderParameterConfig>;
  readonly responses: ReadonlyArray<ApiBuilderResponseConfig>;
  readonly attributes: ReadonlyArray<ApiBuilderAttributeConfig>;
}

export interface ApiBuilderOrganizationConfig {
  readonly key: string;
}

/**
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#enum-parameter_location
 */
export type ApiBuilderParameterLocation = 'Path' | 'Query' | 'Form' | 'Header';

/**
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-parameter
 */
export interface ApiBuilderParameterConfig {
  readonly name: string;
  readonly type: string;
  readonly location: ApiBuilderParameterLocation;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly required: boolean;
  readonly default?: string;
  readonly minimum?: number;
  readonly maximum?: number;
  readonly example?: string;
  readonly attributes?: ApiBuilderAttributeConfig[];
}

/**
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/0.11.94#model-resource
 */
export interface ApiBuilderResourceConfig {
  readonly type: string;
  readonly plural: string;
  readonly path?: string;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly operations: ReadonlyArray<ApiBuilderOperationConfig>;
  readonly attributes: ReadonlyArray<ApiBuilderAttributeConfig>;
}

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

export interface ApiBuilderServiceConfig {
  readonly apidoc: ApiBuilderApiDocConfig;
  readonly name: string;
  readonly organization: ApiBuilderOrganizationConfig;
  readonly application: ApiBuilderApplicationConfig;
  readonly namespace: string;
  readonly version: string;
  readonly base_url?: string;
  readonly description?: string;
  readonly info: ApiBuilderInfoConfig;
  readonly headers: ReadonlyArray<ApiBuilderHeaderConfig>;
  readonly imports: ReadonlyArray<ApiBuilderImportConfig>;
  readonly enums: ReadonlyArray<ApiBuilderEnumConfig>;
  readonly unions: ReadonlyArray<ApiBuilderUnionConfig>;
  readonly models: ReadonlyArray<ApiBuilderModelConfig>;
  readonly resources: ReadonlyArray<ApiBuilderResourceConfig>;
  readonly attributes: ReadonlyArray<ApiBuilderAttributeConfig>;
  readonly annotations: ReadonlyArray<ApiBuilderAnnotationConfig>;
}

export interface ApiBuilderUnionConfig {
  readonly name: string;
  readonly plural: string;
  readonly discriminator?: string;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly types: ReadonlyArray<ApiBuilderUnionTypeConfig>;
  readonly attributes: ReadonlyArray<ApiBuilderAttributeConfig>;
}

/**
 * An object representing an API builder union type definition.
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-union_type
 */
export interface ApiBuilderUnionTypeConfig {
  readonly type: string;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly attributes: ReadonlyArray<ApiBuilderAttributeConfig>;
  readonly default?: boolean;
  readonly discriminator_value?: string;
}

export type ApiBuilderEnclosingType =
  | ApiBuilderArray
  | ApiBuilderMap;

export type ApiBuilderType =
  | ApiBuilderPrimitiveType
  | ApiBuilderArray
  | ApiBuilderMap
  | ApiBuilderModel
  | ApiBuilderEnum
  | ApiBuilderUnion;
