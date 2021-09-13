import overSome from 'lodash/overSome';
import matchesProperty from 'lodash/matchesProperty';
import flatMap from 'lodash/flatMap';

import { ApiBuilderServiceConfig } from './types';
import ApiBuilderEnum from './ApiBuilderEnum';
import ApiBuilderImport from './ApiBuilderImport';
import ApiBuilderModel from './ApiBuilderModel';
import ApiBuilderResource from './ApiBuilderResource';
import ApiBuilderUnion from './ApiBuilderUnion';

/**
 * Wraps an apibuilder service definition and provides utilities for
 * interacting with it.
 */
export default class ApiBuilderService {
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

  get description() {
    return this.config.description;
  }

  get info() {
    return this.config.info;
  }

  get applicationKey() {
    return this.config.application.key;
  }

  get organizationKey() {
    return this.config.organization.key;
  }

  get imports() {
    const imports = this.config.imports.map((config) => new ApiBuilderImport(config, this));
    Object.defineProperty(this, 'imports', { value: imports });
    return imports;
  }

  get enums() {
    const enums = this.config.enums.map((config) => ApiBuilderEnum.fromConfig(config, this));
    Object.defineProperty(this, 'enums', { value: enums });
    return enums;
  }

  get models() {
    const models = this.config.models.map((config) => ApiBuilderModel.fromConfig(config, this));
    Object.defineProperty(this, 'models', { value: models });
    return models;
  }

  get unions() {
    const unions = this.config.unions.map((config) => ApiBuilderUnion.fromConfig(config, this));
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
    const resources = this.config.resources.map(
      (resource) => new ApiBuilderResource(resource, this),
    );
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
