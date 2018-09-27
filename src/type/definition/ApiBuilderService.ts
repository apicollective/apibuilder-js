import { find, flatMap, map, matchesProperty, memoize, overSome, property, ArrayIterator } from 'lodash';
import { ApiBuilderAttributeConfig } from './ApiBuilderAttribute';
import { ApiBuilderEnum, ApiBuilderEnumConfig } from './ApiBuilderEnum';
import { ApiBuilderImport, ApiBuilderImportConfig } from './ApiBuilderImport';
import { ApiBuilderModel, ApiBuilderModelConfig } from './ApiBuilderModel';
import { ApiBuilderResource, ApiBuilderResourceConfig, ApiBuilderHeaderConfig } from './ApiBuilderResource';
import { ApiBuilderUnion, ApiBuilderUnionConfig } from './ApiBuilderUnion';

const cache = new Map();

function cacheable<T, TResult>(iteratee: ArrayIterator<T, TResult>) {
  return function iterator(value: T, index: number, collection: T[]) {
    const cachedValue: TResult | undefined = cache.get(value);

    if (cachedValue) {
      return cachedValue;
    }

    const resultValue = iteratee(value, index, collection);
    cache.set(value, resultValue);
    return resultValue;
  };
}

export interface ApiBuilderApiDocConfig {
  readonly version: string;
}

export interface ApiBuilderOrganizationConfig {
  readonly key: string;
}

export interface ApiBuilderApplicationConfig {
  readonly key: string;
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
 * Describes the software license contact for this service
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-license
 */
export interface ApiBuilderLicenseConfig {
  readonly name: string;
  readonly url?: string;
}

/**
 * General metadata about this service
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-info
 */
export interface ApiBuilderInfoConfig {
  readonly license?: ApiBuilderLicenseConfig;
  readonly contact?: ApiBuilderContactConfig;
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

  get applicationKey() {
    return this.config.application.key;
  }

  get organizationKey() {
    return this.config.organization.key;
  }

  get imports() {
    return map(this.config.imports, config => new ApiBuilderImport(config, this));
  }

  get enums() {
    return [
      ...this.internalEnums,
      ...this.externalEnums,
    ];
  }

  get models() {
    return [
      ...this.internalModels,
      ...this.externalModels,
    ];
  }

  get unions() {
    return [
      ...this.internalUnions,
      ...this.externalUnions,
    ];
  }

  get types() {
    return [
      ...this.internalTypes,
      ...this.externalTypes,
    ];
  }

  get internalEnums() {
    return map(this.config.enums, (config) => {
      const cachedEnumeration: ApiBuilderEnum | undefined = cache.get(config);
      if (cachedEnumeration) return cachedEnumeration;
      const enumeration = ApiBuilderEnum.fromConfig(config, this);
      cache.set(config, enumeration);
      return enumeration;
    });
  }

  get internalModels() {
    return map(this.config.models, (config) => {
      const cachedModel: ApiBuilderModel | undefined = cache.get(config);
      if (cachedModel) return cachedModel;
      const model = ApiBuilderModel.fromConfig(config, this);
      cache.set(config, model);
      return model;
    });
  }

  get internalUnions() {
    return map(this.config.unions, (config) => {
      const cachedUnion: ApiBuilderUnion | undefined = cache.get(config);
      if (cachedUnion) return cachedUnion;
      const union = ApiBuilderUnion.fromConfig(config, this);
      cache.set(config, union);
      return union;
    });
  }

  get internalTypes() {
    return [
      ...this.internalEnums,
      ...this.internalModels,
      ...this.internalUnions,
    ];
  }

  get externalEnums() {
    return flatMap(this.imports, im => im.enums);
  }

  get externalModels() {
    return flatMap(this.imports, im => im.models);
  }

  get externalUnions() {
    return flatMap(this.imports, im => im.unions);
  }

  get externalTypes() {
    return [
      ...this.externalEnums,
      ...this.externalModels,
      ...this.externalUnions,
    ];
  }

  get resources() {
    return map(this.config.resources, (
      resource => new ApiBuilderResource(resource, this)
    ));
  }

  get baseUrl() {
    return this.config.base_url;
  }

  public findTypeByName(typeName: string): ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion | undefined {
    // By definition, a field or union type whose name is not fully qualified
    // implies the type is defined internally, that is such type is not imported.
    // Since internal types precede external types in the list of types held
    // by this object, we can guarantee that searching for a type by name will
    // honor this rule.
    return find(this.types, overSome([
      matchesProperty('shortName', typeName),
      matchesProperty('baseTypeName', typeName),
    ]));
  }

  public toString() {
    return `${this.applicationKey}@${this.version}`;
  }
}
