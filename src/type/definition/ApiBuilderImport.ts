import pluralize from 'pluralize';
import { find, matchesProperty, overSome } from 'lodash';
import { ApiBuilderEnum, ApiBuilderEnumConfig } from './ApiBuilderEnum';
import { ApiBuilderModel, ApiBuilderModelConfig } from './ApiBuilderModel';
import { ApiBuilderUnion, ApiBuilderUnionConfig } from './ApiBuilderUnion';
import { ApiBuilderService, ApiBuilderApplicationConfig, ApiBuilderOrganizationConfig } from './ApiBuilderService';

function findTypeByName<T>(types: T[], name: string): T | undefined {
  return find(types, overSome([
    matchesProperty('shortName', name),
    matchesProperty('baseTypeName', name),
  ]));
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
}

export class ApiBuilderImport {
  private config: ApiBuilderImportConfig;
  private service: ApiBuilderService;

  constructor(config: ApiBuilderImportConfig, service: ApiBuilderService) {
    this.config = config;
    this.service = service;
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
