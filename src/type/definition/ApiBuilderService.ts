import { flatMap, matchesProperty, overSome } from 'lodash';
import { ApiBuilderAttributeConfig } from './ApiBuilderAttribute';
import { ApiBuilderEnum, ApiBuilderEnumConfig } from './ApiBuilderEnum';
import { ApiBuilderHeaderConfig } from './ApiBuilderHeader';
import { ApiBuilderImport, ApiBuilderImportConfig } from './ApiBuilderImport';
import { ApiBuilderModel, ApiBuilderModelConfig } from './ApiBuilderModel';
import { ApiBuilderResource, ApiBuilderResourceConfig } from './ApiBuilderResource';
import { ApiBuilderUnion, ApiBuilderUnionConfig } from './ApiBuilderUnion';

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

  get resources() {
    const resources = this.config.resources.map(resource => new ApiBuilderResource(resource, this));
    Object.defineProperty(this, 'resources', { value: resources });
    return resources;
  }

  get baseUrl() {
    return this.config.base_url;
  }

  public findTypeByName(typeName: string): ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion | undefined {
    // By definition, a field or union type whose name is not fully qualified
    // implies the type is defined internally, that is such type is not
    // imported. In order to honor this rule, this utility will scan for
    // internal types matching the provided name before scanning imported types.
    const predicate = overSome([
      matchesProperty('shortName', typeName),
      matchesProperty('baseTypeName', typeName),
    ]);

    return (
      this.enums.find(predicate)
      || this.models.find(predicate)
      || this.unions.find(predicate)
      || flatMap(this.imports, 'enums').find(predicate)
      || flatMap(this.imports, 'models').find(predicate)
      || flatMap(this.imports, 'unions').find(predicate)
    );
  }

  public toString() {
    return `${this.applicationKey}@${this.version}`;
  }
}
