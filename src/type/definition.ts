import { camelCase, flatMap, map, matchesProperty, overSome, snakeCase, toUpper, upperFirst } from 'lodash';
import invariant from 'invariant';
import pluralize from 'pluralize';

import { astFromTypeName, FullyQualifiedName, typeFromAst } from '../language';

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

function findTypeByName<T>(
  types: T[],
  name: string,
): T | undefined {
  return types.find(overSome([
    matchesProperty('shortName', name),
    matchesProperty('baseTypeName', name),
  ]));
}

function pascalCase(string: string) {
  return upperFirst(camelCase(string));
}

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
 * An array is an enclosing type which points to another type.
 * Arrays are often created within the context of defining the fields of
 * a model type.
 */
export class ApiBuilderArray {
  public ofType: ApiBuilderType;

  constructor(ofType: ApiBuilderType) {
    this.ofType = ofType;
  }

  public toString() {
    return `[${String(this.ofType)}]`;
  }
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

export class ApiBuilderBody {
  private config: ApiBuilderBodyConfig;
  private service: ApiBuilderService;

  constructor(
    config: ApiBuilderBodyConfig,
    service: ApiBuilderService,
  ) {
    this.config = config;
    this.service = service;
  }

  get type() {
    return typeFromAst(astFromTypeName(this.config.type), this.service);
  }

  get description() {
    return this.config.description;
  }

  get isDeprecated() {
    return this.config.deprecation != null;
  }
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

/**
 * An object representing an API builder enum definition.
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-enum
 */
export class ApiBuilderEnum {
  private config: ApiBuilderEnumConfig;
  private fullyQualifiedName: FullyQualifiedName;
  private service: ApiBuilderService;

  /**
   * Returns the ApiBuilderEnum corresponding to the specified enum definition.
   */
  public static fromConfig(
    config: ApiBuilderEnumConfig,
    service: ApiBuilderService,
    namespace: string = service.namespace,
  ) {
    const fullyQualifiedName = new FullyQualifiedName(`${namespace}.enums.${config.name}`);
    return new ApiBuilderEnum(fullyQualifiedName, config, service);
  }

  constructor(
    fullyQualifiedName: FullyQualifiedName,
    config: ApiBuilderEnumConfig,
    service: ApiBuilderService,
  ) {
    invariant(
      !fullyQualifiedName.isEnclosingType,
      `${String(fullyQualifiedName)} is the name of a collection type. ` +
      'You cannot create an enumeration from a collection type.',
    );

    invariant(
      !fullyQualifiedName.isPrimitiveType,
      `${String(fullyQualifiedName)} is the name of a primitive type. ` +
      'You cannot create an enumeration from a primitive type.',
    );

    this.config = config;
    this.fullyQualifiedName = fullyQualifiedName;
    this.service = service;
  }

  get fullName() {
    return this.fullyQualifiedName.fullName;
  }

  get baseTypeName() {
    return this.fullyQualifiedName.baseTypeName;
  }

  get shortName() {
    return this.fullyQualifiedName.shortName;
  }

  get packageName() {
    return this.fullyQualifiedName.packageName;
  }

  get name() {
    return this.config.name;
  }

  /**
   * A string used to identify this enumeration. Useful for naming the variable
   * corresponding to this enumeration in code generators.
   */
  get nickname() {
    return upperFirst(camelCase(this.name));
  }

  get plural() {
    return this.config.plural;
  }

  get description() {
    return this.config.description;
  }

  get values() {
    return this.config.values.map(value => new ApiBuilderEnumValue(value));
  }

  get attributes() {
    return this.config.attributes;
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

  public toString() {
    return this.fullName;
  }
}

export interface ApiBuilderEnumValueConfig {
  readonly name: string;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly attributes?:	ReadonlyArray<ApiBuilderAttributeConfig>;
  readonly value?: string;
}

/**
 * An object representing an API builder enum value definition.
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-enum_value
 */
export class ApiBuilderEnumValue {
  private config: ApiBuilderEnumValueConfig;

  constructor(config: ApiBuilderEnumValueConfig) {
    this.config = config;
  }

  /**
   * This property holds the name of the enum value.
   */
  get name() {
    return this.config.name;
  }

  /**
   * A string used to identify this enumeration value. Useful for naming the
   * variable corresponding to this enumeration value in code generators.
   */
  get nickname() {
    return toUpper(snakeCase(this.name));
  }

  /**
   * This property holds an optional description for what
   * this enum value provides.
   */
  get description() {
    return this.config.description;
  }

  /**
   * This property holds additional meta data about enum value.
   */
  get attributes() {
    return this.config.attributes;
  }

  /**
   * This property holds whether this enum value is deprecated.
   */
  get isDeprecated() {
    return this.config.deprecation != null;
  }

  /**
   * This property holds an optional message indicating the reason this
   * enum value is deprecated.
   */
  get deprecationReason() {
    if (this.config.deprecation != null) {
      return this.config.deprecation.description;
    }

    return undefined;
  }

  public toString() {
    return this.name;
  }
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

export class ApiBuilderField {
  private config: ApiBuilderFieldConfig;
  private service: ApiBuilderService;

  constructor(config: ApiBuilderFieldConfig, service: ApiBuilderService) {
    this.config = config;
    this.service = service;
  }

  get name() {
    return this.config.name;
  }

  get type() {
    return typeFromAst(astFromTypeName(this.config.type), this.service);
  }

  get description() {
    return this.config.description;
  }

  get isRequired() {
    return this.config.required;
  }

  get default() {
    return this.config.default;
  }

  get example() {
    return this.config.example;
  }

  get minimum() {
    return this.config.minimum;
  }

  get maximum() {
    return this.config.maximum;
  }

  get attributes() {
    return this.config.attributes;
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

  public toString() {
    return this.name;
  }
}

export type ApiBuilderFileFlag = 'scaffolding';

export interface ApiBuilderFileConfig {
  readonly name: string;
  readonly dir: string;
  readonly contents: string;
  readonly flags?: ApiBuilderFileFlag;
}

/**
 * Class representing a generated source file.
 * @see https://app.apibuilder.io/bryzek/apidoc-generator/latest#model-file
 */
export class ApiBuilderFile {
  public name: string;
  public dir: string;
  public contents: string;
  public flags: ApiBuilderFileFlag | undefined;

  /**
   * Create a source file.
   * @param basename The recommended name for the file, including the file extension.
   * @param dirname The recommended directory path for the file where appropriate.
   * @param contents The actual source code.
   */
  constructor(
    basename: string,
    dirname: string,
    contents: string,
    flags?: ApiBuilderFileFlag,
  ) {
    this.name = basename;
    this.dir = dirname;
    this.contents = contents;
    this.flags = flags;
  }
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

export class ApiBuilderImport {
  private config: ApiBuilderImportConfig;
  private service: ApiBuilderService;

  constructor(config: ApiBuilderImportConfig, service: ApiBuilderService) {
    this.config = config;
    this.service = service;
  }

  get annotations() {
    return this.config.annotations;
  }

  get namespace() {
    return this.config.namespace;
  }

  get organizationKey() {
    return this.config.organization.key;
  }

  get applicationKey() {
    return this.config.application.key;
  }

  get version() {
    return this.config.version;
  }

  get enums() {
    const enums = this.config.enums.map((enumeration) => {
      const config: ApiBuilderEnumConfig = {
        name: enumeration,
        plural: pluralize(enumeration),
        values: [],
        attributes: [],
      };
      return ApiBuilderEnum.fromConfig(config, this.service, this.namespace);
    });
    Object.defineProperty(this, 'enums', { value: enums });
    return enums;
  }

  get models() {
    const models = this.config.models.map((model) => {
      const config: ApiBuilderModelConfig = {
        name: model,
        plural: pluralize(model),
        fields: [],
        attributes: [],
      };
      return ApiBuilderModel.fromConfig(config, this.service, this.namespace);
    });
    Object.defineProperty(this, 'models', { value: models });
    return models;
  }

  get unions() {
    const unions = this.config.unions.map((union) => {
      const config: ApiBuilderUnionConfig = {
        name: union,
        plural: pluralize(union),
        types: [],
        attributes: [],
      };
      return ApiBuilderUnion.fromConfig(config, this.service, this.namespace);
    });
    Object.defineProperty(this, 'unions', { value: unions });
    return unions;
  }

  public findEnumByName(name: string) {
    return findTypeByName(this.enums, name);
  }

  public findModelByName(name: string) {
    return findTypeByName(this.models, name);
  }

  public findUnionByName(name: string) {
    return findTypeByName(this.unions, name);
  }

  public toString() {
    return `${this.applicationKey}@${this.version}`;
  }
}

/**
 * General metadata about this service
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-info
 */
export interface ApiBuilderInfoConfig {
  readonly license?: ApiBuilderLicenseConfig;
  readonly contact?: ApiBuilderContactConfig;
}

interface ApiBuilderGeneratorAttributes {
  readonly name: string;
  readonly value: string;
}

export interface ApiBuilderInvocationFormConfig {
  service: ApiBuilderServiceConfig;
  attributes: ApiBuilderGeneratorAttributes[];
  user_agent?: string;
  imported_services?: ApiBuilderServiceConfig[];
}

export class ApiBuilderInvocationForm {
  config: ApiBuilderInvocationFormConfig;

  constructor(config: ApiBuilderInvocationFormConfig) {
    this.config = config;
  }

  get attributes() {
    return this.config.attributes;
  }

  get service() {
    return new ApiBuilderService(this.config.service);
  }

  get importedServices() {
    return (this.config.imported_services || []).map(importedService => (
      new ApiBuilderService(importedService)
    ));
  }

  get userAgent() {
    return this.config.user_agent;
  }
}

/**
 * Describes the software license contact for this service
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-license
 */
export interface ApiBuilderLicenseConfig {
  readonly name: string;
  readonly url?: string;
}

/**
 * A map is an enclosing type which points to another type.
 * Maps are often created within the context of defining the fields of
 * a model type.
 */
export class ApiBuilderMap {
  public ofType: ApiBuilderType;

  constructor(ofType: ApiBuilderType) {
    this.ofType = ofType;
  }

  public toString() {
    return `map[${String(this.ofType)}]`;
  }
}

export interface ApiBuilderModelConfig {
  readonly name: string;
  readonly plural: string;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly fields: ReadonlyArray<ApiBuilderFieldConfig>;
  readonly attributes: ReadonlyArray<ApiBuilderAttributeConfig>;
}

export class ApiBuilderModel {
  private config: ApiBuilderModelConfig;
  private fullyQualifiedName: FullyQualifiedName;
  private service: ApiBuilderService;

  /**
   * Returns the ApiBuilderModel corresponding to the specified API builder
   * model definition.
   */
  public static fromConfig(
    config: ApiBuilderModelConfig,
    service: ApiBuilderService,
    namespace: string = service.namespace,
  ) {
    const fullyQualifiedName = new FullyQualifiedName(`${namespace}.models.${config.name}`);
    return new ApiBuilderModel(fullyQualifiedName, config, service);
  }

  constructor(
    fullyQualifiedName: FullyQualifiedName,
    config: ApiBuilderModelConfig,
    service: ApiBuilderService,
  ) {
    invariant(
      !fullyQualifiedName.isEnclosingType,
      `${String(fullyQualifiedName)} is the name of an enclosing type. ` +
      'You cannot create a model from an enclosing type.',
    );

    invariant(
      !fullyQualifiedName.isPrimitiveType,
      `${String(fullyQualifiedName)} is the name of a primitive type. ` +
      'You cannot create an model from a primitive type.',
    );

    this.config = config;
    this.fullyQualifiedName = fullyQualifiedName;
    this.service = service;
  }

  get fullName() {
    return this.fullyQualifiedName.fullName;
  }

  get baseTypeName() {
    return this.fullyQualifiedName.baseTypeName;
  }

  get shortName() {
    return this.fullyQualifiedName.shortName;
  }

  get packageName() {
    return this.fullyQualifiedName.packageName;
  }

  get isDeprecated() {
    return this.config.deprecation != null;
  }

  get description() {
    return this.config.description;
  }

  get fields() {
    return this.config.fields.map(field => new ApiBuilderField(field, this.service));
  }

  public toString() {
    return this.fullName;
  }
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

export class ApiBuilderOperation {
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
    let path = this.config.path;

    if (this.resource.path != null) {
      path = path.replace(this.resource.path, '');
    }

    if (path.startsWith('/')) {
      path = path.slice(1);
    }

    const parts = path.split('/');

    const dynamicParts = parts.filter((part) => {
      return part.startsWith(':');
    }).map((part, index) => {
      const prefix = index === 0 ? 'By' : 'And';
      return prefix + pascalCase(part);
    });

    const staticParts = parts.filter((part) => {
      return !part.startsWith(':');
    }).map((part, index) => {
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
      parameter => new ApiBuilderParameter(parameter, this.service)
    ));
  }

  get responses() {
    return this.config.responses.map((response) => {
      return new ApiBuilderResponse(response, this.service);
    });
  }

  /**
   * Returns the response object matching the specified response code.
   * @param responseCode
   * @param useDefault
   * Indicates whether to fallback to the default response object for all
   * HTTP codes that are not covered individually by the specification.
   */
  getResponseByCode(responseCode: number, useDefault: boolean = false) {
    const response = this.responses.find(response => response.code === responseCode);

    if (response != null) {
      return response;
    }

    if (useDefault) {
      return this.responses.find(response => response.isDefault);
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

export class ApiBuilderParameter {
  private config: ApiBuilderParameterConfig;
  private service: ApiBuilderService;

  constructor(config: ApiBuilderParameterConfig, service: ApiBuilderService) {
    this.config = config;
    this.service = service;
  }

  get name() {
    return this.config.name;
  }

  get type() {
    return typeFromAst(astFromTypeName(this.config.type), this.service);
  }

  get defaultValue() {
    return this.config.default;
  }

  get deprecation() {
    return this.config.deprecation;
  }

  get description() {
    return this.config.description;
  }

  get location() {
    return this.config.location;
  }

  get isRequired() {
    return this.config.required;
  }
}

export class ApiBuilderPrimitiveType {
  private fullyQualifiedName: FullyQualifiedName;

  constructor(fullyQualifiedName: FullyQualifiedName) {
    invariant(
      fullyQualifiedName.isPrimitiveType,
      `${String(fullyQualifiedName)} is not an API builder primitive type.`,
    );

    this.fullyQualifiedName = fullyQualifiedName;
  }

  get fullName() {
    return this.fullyQualifiedName.fullName;
  }

  get baseTypeName() {
    return this.fullyQualifiedName.baseTypeName;
  }

  get shortName() {
    return this.fullyQualifiedName.shortName;
  }

  get packageName() {
    return this.fullyQualifiedName.packageName;
  }

  get typeName() {
    return this.fullyQualifiedName.fullName;
  }

  public toString() {
    return this.baseTypeName;
  }
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

export class ApiBuilderResource {
  private config: ApiBuilderResourceConfig;
  private service: ApiBuilderService;

  constructor(config: ApiBuilderResourceConfig, service: ApiBuilderService) {
    this.config = config;
    this.service = service;
  }

  get operations() {
    return this.config.operations.map((
      operation => new ApiBuilderOperation(operation, this, this.service)
    ));
  }

  get type() {
    return typeFromAst(astFromTypeName(this.config.type), this.service);
  }

  get typeName() {
    return this.config.type;
  }

  get plural() {
    return this.config.plural;
  }

  get namespace() {
    return this.service.namespace;
  }

  get path() {
    return this.config.path;
  }
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

    return undefined;
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

    return undefined;
  }

  get attributes() {
    return this.config.attributes;
  }
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

/**
 * Wraps an apibuilder service definition and provides utilities for
 * interacting with it.
 */
export class ApiBuilderService {
  private config: ApiBuilderServiceConfig;

  constructor(config: ApiBuilderServiceConfig) {
    this.config = config;
  }

  get name() {
    return this.config.name;
  }

  get namespace() {
    return this.config.namespace;
  }

  get version() {
    return this.config.version;
  }

  get description () {
    return this.config.description;
  }

  get info () {
    return this.config.info;
  }

  get applicationKey() {
    return this.config.application.key;
  }

  get organizationKey() {
    return this.config.organization.key;
  }

  get imports() {
    const imports = this.config.imports.map(config => new ApiBuilderImport(config, this));
    Object.defineProperty(this, 'imports', { value: imports });
    return imports;
  }

  get enums() {
    const enums = this.config.enums.map(config => ApiBuilderEnum.fromConfig(config, this));
    Object.defineProperty(this, 'enums', { value: enums });
    return enums;
  }

  get models() {
    const models = this.config.models.map(config => ApiBuilderModel.fromConfig(config, this));
    Object.defineProperty(this, 'models', { value: models });
    return models;
  }

  get unions() {
    const unions = this.config.unions.map(config => ApiBuilderUnion.fromConfig(config, this));
    Object.defineProperty(this, 'unions', { value: unions });
    return unions;
  }

  get typesByFullName() {
    const typesByFullName: Record<string, ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion> = {};

    this.enums.forEach((enumeration) => {
      typesByFullName[enumeration.fullName] = enumeration;
    });

    this.models.forEach((model) => {
      typesByFullName[model.fullName] = model;
    });

    this.unions.forEach((union) => {
      typesByFullName[union.fullName] = union;
    });

    Object.defineProperty(this, 'typesByFullName', {
      value: typesByFullName,
    });

    return typesByFullName;
  }

  get typesByShortName() {
    const typesByShortName: Record<string, ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion> = {};

    this.enums.forEach((enumeration) => {
      typesByShortName[enumeration.shortName] = enumeration;
    });

    this.models.forEach((model) => {
      typesByShortName[model.shortName] = model;
    });

    this.unions.forEach((union) => {
      typesByShortName[union.shortName] = union;
    });

    Object.defineProperty(this, 'typesByShortName', {
      value: typesByShortName,
    });

    return typesByShortName;
  }

  get resources() {
    const resources = this.config.resources.map(resource => new ApiBuilderResource(resource, this));
    Object.defineProperty(this, 'resources', { value: resources });
    return resources;
  }

  get baseUrl() {
    return this.config.base_url;
  }

  /**
   * Returns the type matching the specified identifier, or `undefined` otherwise.
   * @param typeName
   */
  public findTypeByName(
    typeName: string,
  ): ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion | undefined {
    if (this.typesByFullName[typeName] != null) {
      return this.typesByFullName[typeName];
    }

    if (this.typesByShortName[typeName] != null) {
      return this.typesByShortName[typeName];
    }

    const predicate = overSome([
      matchesProperty('shortName', typeName),
      matchesProperty('baseTypeName', typeName),
    ]);

    return (
      flatMap(this.imports, 'enums').find(predicate)
      || flatMap(this.imports, 'models').find(predicate)
      || flatMap(this.imports, 'unions').find(predicate)
    );
  }

  public toString() {
    return `${this.applicationKey}@${this.version}`;
  }
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

export class ApiBuilderUnion {
  private config: ApiBuilderUnionConfig;
  private fullyQualifiedName: FullyQualifiedName;
  private service: ApiBuilderService;

  /**
   * Returns the ApiBuilderUnion corresponding to the specified API Builder
   * union definition.
   */
  public static fromConfig(
    config: ApiBuilderUnionConfig,
    service: ApiBuilderService,
    namespace = service.namespace,
  ) {
    const fullyQualifiedName = new FullyQualifiedName(`${namespace}.unions.${config.name}`);
    return new ApiBuilderUnion(fullyQualifiedName, config, service);
  }

  constructor(
    fullyQualifiedName: FullyQualifiedName,
    config: ApiBuilderUnionConfig,
    service: ApiBuilderService,
  ) {
    invariant(
      !fullyQualifiedName.isEnclosingType,
      `${String(fullyQualifiedName)} is a collection type. ` +
      'You cannot create an union from a collection type.',
    );

    invariant(
      !fullyQualifiedName.isPrimitiveType,
      `${String(fullyQualifiedName)} is a primitive type. ` +
      'You cannot create an union from a primitive type.',
    );

    this.config = config;
    this.fullyQualifiedName = fullyQualifiedName;
    this.service = service;
  }

  get fullName() {
    return this.fullyQualifiedName.fullName;
  }

  get baseTypeName() {
    return this.fullyQualifiedName.baseTypeName;
  }

  get shortName() {
    return this.fullyQualifiedName.shortName;
  }

  get packageName() {
    return this.fullyQualifiedName.packageName;
  }

  get name() {
    return this.config.name;
  }

  get plural() {
    return this.config.plural;
  }

  get discriminator() {
    return this.config.discriminator || 'discriminator';
  }

  get description() {
    return this.config.description;
  }

  get deprecation() {
    return this.config.deprecation;
  }

  get types() {
    return map(this.config.types, (
      type => new ApiBuilderUnionType(type, this.service)
    ));
  }

  get attributes() {
    return this.config.attributes;
  }

  public toString() {
    return this.fullName;
  }
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

/**
 * An object representing an API builder union definition
 * * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-union
 */
export class ApiBuilderUnionType {
  private config: ApiBuilderUnionTypeConfig;
  private service: ApiBuilderService;

  constructor(config: ApiBuilderUnionTypeConfig, service: ApiBuilderService) {
    this.config = config;
    this.service = service;
  }

  get type() {
    return typeFromAst(astFromTypeName(this.config.type), this.service);
  }

  get typeName() {
    return this.config.type;
  }

  get description() {
    return this.config.description;
  }

  get deprecation() {
    return this.config.deprecation;
  }

  get attributes() {
    return this.config.attributes;
  }

  get default() {
    return this.config.default;
  }

  get discriminatorValue() {
    return this.config.discriminator_value || this.config.type;
  }

  public toString() {
    return this.config.type;
  }
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
