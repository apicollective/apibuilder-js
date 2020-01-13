import {
  camelCase,
  find,
  flatMap,
  map,
  matchesProperty,
  overSome,
  snakeCase,
  toUpper,
  upperFirst,
} from 'lodash';
import invariant from 'invariant';
import pluralize from 'pluralize';

import * as ApiBuilderSpec from '../generated/types/apibuilder-spec';
import * as ApiBuilderGenerator from '../generated/types/apibuilder-generator';
import { FullyQualifiedName, astFromTypeName, typeFromAst } from '../language';

function findTypeByName<T>(types: T[], name: string): T | undefined {
  return find(types, overSome([
    matchesProperty('shortName', name),
    matchesProperty('baseTypeName', name),
  ]));
}

export class ApiBuilderArray {
  public ofType: ApiBuilderType;

  constructor(ofType: ApiBuilderType) {
    this.ofType = ofType;
  }

  public toString(): string {
    return `[${String(this.ofType)}]`;
  }
}

export class ApiBuilderBody {
  private config: ApiBuilderSpec.Body;
  private service: ApiBuilderService;

  constructor(
    config: ApiBuilderSpec.Body,
    service: ApiBuilderService,
  ) {
    this.config = config;
    this.service = service;
  }

  get type(): ApiBuilderType {
    return typeFromAst(astFromTypeName(this.config.type), this.service);
  }

  get description(): string | undefined {
    return this.config.description;
  }

  get deprecationReason(): string | undefined {
    if (this.config.deprecation != null) {
      return this.config.deprecation.description;
    }
  }

  get isDeprecated(): boolean {
    return this.config.deprecation != null;
  }
}

export class ApiBuilderEnum {
  private config: ApiBuilderSpec.Enum;
  private fullyQualifiedName: FullyQualifiedName;
  private service: ApiBuilderService;

  /**
   * Returns the ApiBuilderEnum corresponding to the specified enum definition.
   */
  public static fromConfig(
    config: ApiBuilderSpec.Enum,
    service: ApiBuilderService,
    namespace: string = service.namespace,
  ): ApiBuilderEnum {
    const fullyQualifiedName = new FullyQualifiedName(`${namespace}.enums.${config.name}`);
    return new ApiBuilderEnum(fullyQualifiedName, config, service);
  }

  constructor(
    fullyQualifiedName: FullyQualifiedName,
    config: ApiBuilderSpec.Enum,
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

  get fullName(): string {
    return this.fullyQualifiedName.fullName;
  }

  get baseTypeName(): string {
    return this.fullyQualifiedName.baseTypeName;
  }

  get shortName(): string {
    return this.fullyQualifiedName.shortName;
  }

  get packageName(): string {
    return this.fullyQualifiedName.packageName;
  }

  get name(): string {
    return this.config.name;
  }

  /**
   * A string used to identify this enumeration. Useful for naming the variable
   * corresponding to this enumeration in code generators.
   */
  get nickname(): string {
    return upperFirst(camelCase(this.name));
  }

  get plural(): string {
    return this.config.plural;
  }

  get description(): string | undefined {
    return this.config.description;
  }

  get values(): ApiBuilderEnumValue[] {
    return this.config.values.map(value => new ApiBuilderEnumValue(value));
  }

  get attributes(): ApiBuilderSpec.Attribute[] {
    return this.config.attributes;
  }

  get isDeprecated() {
    return this.config.deprecation != null;
  }

  get deprecationReason() {
    if (this.config.deprecation) {
      return this.config.deprecation.description;
    }
  }

  public toString() {
    return this.fullName;
  }
}

export class ApiBuilderEnumValue {
  private config: ApiBuilderSpec.EnumValue;

  constructor(config: ApiBuilderSpec.EnumValue) {
    this.config = config;
  }

  /**
   * This property holds the name of the enum value.
   */
  get name(): string {
    return this.config.name;
  }

  /**
   * A string used to identify this enumeration value. Useful for naming the
   * variable corresponding to this enumeration value in code generators.
   */
  get nickname(): string {
    return toUpper(snakeCase(this.name));
  }

  /**
   * This property holds an optional description for what
   * this enum value provides.
   */
  get description(): string | undefined {
    return this.config.description;
  }

  /**
   * This property holds additional meta data about enum value.
   */
  get attributes(): ApiBuilderSpec.Attribute[] {
    return this.config.attributes;
  }

  /**
   * This property holds whether this enum value is deprecated.
   */
  get isDeprecated(): boolean {
    return this.config.deprecation != null;
  }

  /**
   * This property holds an optional message indicating the reason this
   * enum value is deprecated.
   */
  get deprecationReason(): string | undefined {
    if (this.config.deprecation != null) {
      return this.config.deprecation.description;
    }
  }

  public toString(): string {
    return this.name;
  }
}

export class ApiBuilderField {
  private config: ApiBuilderSpec.Field;
  private service: ApiBuilderService;

  constructor(config: ApiBuilderSpec.Field, service: ApiBuilderService) {
    this.config = config;
    this.service = service;
  }

  get name(): string {
    return this.config.name;
  }

  get type(): ApiBuilderType {
    return typeFromAst(astFromTypeName(this.config.type), this.service);
  }

  get description(): string | undefined {
    return this.config.description;
  }

  get isRequired(): boolean {
    return this.config.required;
  }

  get default(): string | undefined {
    return this.config.default;
  }

  get example(): string | undefined {
    return this.config.example;
  }

  get minimum(): number | undefined {
    return this.config.minimum;
  }

  get maximum(): number | undefined {
    return this.config.maximum;
  }

  get attributes(): ApiBuilderSpec.Attribute[] {
    return this.config.attributes;
  }

  get isDeprecated(): boolean {
    return this.config.deprecation != null;
  }

  get deprecationReason(): string | undefined {
    if (this.config.deprecation != null) {
      return this.config.deprecation.description;
    }
  }

  public toString(): string {
    return this.name;
  }
}

export class ApiBuilderFile {
  public name: string;
  public dir: string;
  public contents: string;

  /**
   * Create a source file.
   * @param basename The recommended name for the file, including the file extension.
   * @param dirname The recommended directory path for the file where appropriate.
   * @param contents The actual source code.
   */
  constructor(basename: string, dirname: string, contents: string) {
    this.name = basename;
    this.dir = dirname;
    this.contents = contents;
  }
}

export class ApiBuilderImport {
  private config: ApiBuilderSpec.Import;
  private service: ApiBuilderService;

  constructor(config: ApiBuilderSpec.Import, service: ApiBuilderService) {
    this.config = config;
    this.service = service;
  }

  get namespace(): string {
    return this.config.namespace;
  }

  get organizationKey(): string {
    return this.config.organization.key;
  }

  get applicationKey(): string {
    return this.config.application.key;
  }

  get version(): string {
    return this.config.version;
  }

  get enums(): ApiBuilderEnum[] {
    const enums = this.config.enums.map((enumeration) => {
      const config: ApiBuilderSpec.Enum = {
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

  get models(): ApiBuilderModel[] {
    const models = this.config.models.map((model) => {
      const config: ApiBuilderSpec.Model = {
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

  get unions(): ApiBuilderUnion[] {
    const unions = this.config.unions.map((union) => {
      const config: ApiBuilderSpec.Union = {
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

  public findEnumByName(name: string): ApiBuilderEnum | undefined {
    return findTypeByName(this.enums, name);
  }

  public findModelByName(name: string): ApiBuilderModel | undefined {
    return findTypeByName(this.models, name);
  }

  public findUnionByName(name: string): ApiBuilderUnion | undefined {
    return findTypeByName(this.unions, name);
  }

  public toString(): string {
    return `${this.applicationKey}@${this.version}`;
  }
}

export class ApiBuilderInvocationForm {
  config: ApiBuilderGenerator.InvocationForm;

  constructor(config: ApiBuilderGenerator.InvocationForm) {
    this.config = config;
  }

  get attributes(): ApiBuilderGenerator.Attribute[] {
    return this.config.attributes;
  }

  get service(): ApiBuilderService {
    return new ApiBuilderService(this.config.service);
  }

  get importedServices(): ApiBuilderService[] {
    return (this.config.imported_services || []).map(importedService => (
      new ApiBuilderService(importedService)
    ));
  }

  get userAgent(): string | undefined {
    return this.config.user_agent;
  }
}

export class ApiBuilderMap {
  public ofType: ApiBuilderType;

  constructor(ofType: ApiBuilderType) {
    this.ofType = ofType;
  }

  public toString(): string {
    return `map[${String(this.ofType)}]`;
  }
}

export class ApiBuilderModel {
  private config: ApiBuilderSpec.Model;
  private fullyQualifiedName: FullyQualifiedName;
  private service: ApiBuilderService;

  /**
   * Returns the ApiBuilderModel corresponding to the specified API builder
   * model definition.
   */
  public static fromConfig(
    config: ApiBuilderSpec.Model,
    service: ApiBuilderService,
    namespace: string = service.namespace,
  ): ApiBuilderModel {
    const fullyQualifiedName = new FullyQualifiedName(`${namespace}.models.${config.name}`);
    return new ApiBuilderModel(fullyQualifiedName, config, service);
  }

  constructor(
    fullyQualifiedName: FullyQualifiedName,
    config: ApiBuilderSpec.Model,
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

  get fullName(): string {
    return this.fullyQualifiedName.fullName;
  }

  get baseTypeName(): string {
    return this.fullyQualifiedName.baseTypeName;
  }

  get shortName(): string {
    return this.fullyQualifiedName.shortName;
  }

  get packageName(): string {
    return this.fullyQualifiedName.packageName;
  }

  get isDeprecated(): boolean {
    return this.config.deprecation != null;
  }

  get description(): string | undefined {
    return this.config.description;
  }

  get fields(): ApiBuilderField[] {
    return this.config.fields.map(field => new ApiBuilderField(field, this.service));
  }

  public toString(): string {
    return this.fullName;
  }
}

export class ApiBuilderOperation {
  private config: ApiBuilderSpec.Operation;
  public resource: ApiBuilderResource;
  private service: ApiBuilderService;

  constructor(
    config: ApiBuilderSpec.Operation,
    resource: ApiBuilderResource,
    service: ApiBuilderService,
  ) {
    this.config = config;
    this.service = service;
    this.resource = resource;
  }

  get body(): ApiBuilderSpec.Body | undefined {
    return this.config.body;
  }

  get method(): ApiBuilderSpec.Method {
    return this.config.method;
  }

  get isDeprecated(): boolean {
    return this.config.deprecation != null;
  }

  get deprecationReason(): string | undefined {
    if (this.config.deprecation != null) {
      return this.config.deprecation.description;
    }
  }

  get description(): string | undefined {
    return this.config.description;
  }

  /**
   * A string used to identify this operation. Useful for naming the method
   * corresponding to this operation in code generators.
   */
  get nickname(): never {
    throw new Error('Not Implemented');
  }

  get url(): string {
    return `${this.service.baseUrl}${this.config.path}`;
  }

  get path(): string {
    return this.config.path;
  }

  get parameters(): ApiBuilderParameter[] {
    return this.config.parameters.map((
      parameter => new ApiBuilderParameter(parameter, this.service)
    ));
  }

  get responses(): ApiBuilderResponse[] {
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
  getResponseByCode(
    responseCode: number,
    useDefault: boolean = false,
  ): ApiBuilderResponse | undefined {
    const response = this.responses.find(response => response.code === responseCode);

    if (response != null) {
      return response;
    }

    if (useDefault) {
      return this.responses.find(response => response.isDefault);
    }
  }

  /**
   * Returns the type for the response matching the specified response code.
   * @param responseCode
   * @param useDefault
   * Indicates whether to fallback to the default response object for all
   * HTTP codes that are not covered individually by the specification.
   */
  getResponseTypeByCode(
    responseCode: number,
    useDefault?: boolean,
  ): ApiBuilderType | undefined {
    const response = this.getResponseByCode(responseCode, useDefault);
    return response != null ? response.type : undefined;
  }
}

export class ApiBuilderParameter {
  private config: ApiBuilderSpec.Parameter;
  private service: ApiBuilderService;

  constructor(config: ApiBuilderSpec.Parameter, service: ApiBuilderService) {
    this.config = config;
    this.service = service;
  }

  get name(): string {
    return this.config.name;
  }

  get type(): ApiBuilderType {
    return typeFromAst(astFromTypeName(this.config.type), this.service);
  }

  get defaultValue(): string | undefined {
    return this.config.default;
  }

  get deprecation(): ApiBuilderSpec.Deprecation | undefined {
    return this.config.deprecation;
  }

  get description(): string | undefined {
    return this.config.description;
  }

  get location(): ApiBuilderSpec.ParameterLocation {
    return this.config.location;
  }

  get isRequired(): boolean {
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

  get fullName(): string {
    return this.fullyQualifiedName.fullName;
  }

  get baseTypeName(): string {
    return this.fullyQualifiedName.baseTypeName;
  }

  get shortName(): string {
    return this.fullyQualifiedName.shortName;
  }

  get packageName(): string {
    return this.fullyQualifiedName.packageName;
  }

  get typeName(): string {
    return this.fullyQualifiedName.fullName;
  }

  public toString(): string {
    return this.baseTypeName;
  }
}

export class ApiBuilderResource {
  private config: ApiBuilderSpec.Resource;
  private service: ApiBuilderService;

  constructor(config: ApiBuilderSpec.Resource, service: ApiBuilderService) {
    this.config = config;
    this.service = service;
  }

  get operations(): ApiBuilderOperation[] {
    return this.config.operations.map((
      operation => new ApiBuilderOperation(operation, this, this.service)
    ));
  }

  get type(): ApiBuilderType {
    return typeFromAst(astFromTypeName(this.config.type), this.service);
  }

  get typeName(): string {
    return this.config.type;
  }

  get plural(): string {
    return this.config.plural;
  }

  get namespace() {
    return this.service.namespace;
  }

  get path() {
    return this.config.path;
  }
}

export class ApiBuilderResponse {
  private config: ApiBuilderSpec.Response;
  private service: ApiBuilderService;

  constructor(config: ApiBuilderSpec.Response, service: ApiBuilderService) {
    this.config = config;
    this.service = service;
  }

  get code(): number | undefined {
    switch (this.config.code.discriminator) {
      case 'integer':
        return this.config.code.value;
      default:
        return undefined;
    }
  }

  /**
   * Indicates this is the default response object for all HTTP codes that are
   * not covered individually by the specification.
   */
  get isDefault(): boolean {
    switch (this.config.code.discriminator) {
      case 'integer':
        return false;
      default:
        return this.config.code.value === 'Default';
    }
  }

  get type(): ApiBuilderType {
    return typeFromAst(astFromTypeName(this.config.type || 'unit'), this.service);
  }

  get headers(): ApiBuilderSpec.Header[] | undefined {
    return this.config.headers;
  }

  get description(): string | undefined {
    return this.config.description;
  }

  get isDeprecated(): boolean {
    return this.config.deprecation != null;
  }

  get deprecationReason(): string | undefined {
    if (this.config.deprecation != null) {
      return this.config.deprecation.description;
    }
  }

  get attributes(): ApiBuilderSpec.Attribute[] | undefined {
    return this.config.attributes;
  }
}

export class ApiBuilderService {
  private config: ApiBuilderSpec.Service;

  constructor(config: ApiBuilderSpec.Service) {
    this.config = config;
  }

  get name(): string {
    return this.config.name;
  }

  get namespace(): string {
    return this.config.namespace;
  }

  get version(): string {
    return this.config.version;
  }

  get description(): string | undefined {
    return this.config.description;
  }

  get info(): ApiBuilderSpec.Info {
    return this.config.info;
  }

  get applicationKey(): string {
    return this.config.application.key;
  }

  get organizationKey(): string {
    return this.config.organization.key;
  }

  get imports(): ApiBuilderImport[] {
    const imports = this.config.imports.map(config => new ApiBuilderImport(config, this));
    Object.defineProperty(this, 'imports', { value: imports });
    return imports;
  }

  get enums(): ApiBuilderEnum[] {
    const enums = this.config.enums.map(config => ApiBuilderEnum.fromConfig(config, this));
    Object.defineProperty(this, 'enums', { value: enums });
    return enums;
  }

  get models(): ApiBuilderModel[] {
    const models = this.config.models.map(config => ApiBuilderModel.fromConfig(config, this));
    Object.defineProperty(this, 'models', { value: models });
    return models;
  }

  get unions(): ApiBuilderUnion[] {
    const unions = this.config.unions.map(config => ApiBuilderUnion.fromConfig(config, this));
    Object.defineProperty(this, 'unions', { value: unions });
    return unions;
  }

  get typesByFullName(): Record<string, ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion> {
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

  get typesByShortName(): Record<string, ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion> {
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

  get resources(): ApiBuilderResource[] {
    const resources = this.config.resources.map(resource => new ApiBuilderResource(resource, this));
    Object.defineProperty(this, 'resources', { value: resources });
    return resources;
  }

  get baseUrl(): string | undefined {
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

export class ApiBuilderUnion {
  private config: ApiBuilderSpec.Union;
  private fullyQualifiedName: FullyQualifiedName;
  private service: ApiBuilderService;

  /**
   * Returns the ApiBuilderUnion corresponding to the specified API Builder
   * union definition.
   */
  public static fromConfig(
    config: ApiBuilderSpec.Union,
    service: ApiBuilderService,
    namespace = service.namespace,
  ) {
    const fullyQualifiedName = new FullyQualifiedName(`${namespace}.unions.${config.name}`);
    return new ApiBuilderUnion(fullyQualifiedName, config, service);
  }

  constructor(
    fullyQualifiedName: FullyQualifiedName,
    config: ApiBuilderSpec.Union,
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

  get fullName(): string {
    return this.fullyQualifiedName.fullName;
  }

  get baseTypeName(): string {
    return this.fullyQualifiedName.baseTypeName;
  }

  get shortName(): string {
    return this.fullyQualifiedName.shortName;
  }

  get packageName(): string {
    return this.fullyQualifiedName.packageName;
  }

  get name(): string {
    return this.config.name;
  }

  get plural(): string {
    return this.config.plural;
  }

  get discriminator(): string {
    return this.config.discriminator || 'discriminator';
  }

  get description(): string | undefined {
    return this.config.description;
  }

  get deprecation(): ApiBuilderSpec.Deprecation | undefined {
    return this.config.deprecation;
  }

  get types(): ApiBuilderUnionType[] {
    return map(this.config.types, (
      type => new ApiBuilderUnionType(type, this.service)
    ));
  }

  get attributes(): ApiBuilderSpec.Attribute[] {
    return this.config.attributes;
  }

  public toString(): string {
    return this.fullName;
  }
}

export class ApiBuilderUnionType {
  private config: ApiBuilderSpec.UnionType;
  private service: ApiBuilderService;

  constructor(config: ApiBuilderSpec.UnionType, service: ApiBuilderService) {
    this.config = config;
    this.service = service;
  }

  get type(): ApiBuilderType {
    return typeFromAst(astFromTypeName(this.config.type), this.service);
  }

  get typeName(): string {
    return this.config.type;
  }

  get description(): string | undefined {
    return this.config.description;
  }

  get deprecation(): ApiBuilderSpec.Deprecation | undefined {
    return this.config.deprecation;
  }

  get attributes(): ApiBuilderSpec.Attribute[] {
    return this.config.attributes;
  }

  get default(): boolean {
    return this.config.default != null ? this.config.default : false;
  }

  get discriminatorValue(): string {
    return this.config.discriminator_value || this.config.type;
  }

  public toString(): string {
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
