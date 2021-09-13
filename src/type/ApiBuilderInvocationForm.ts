import type { ApiBuilderServiceConfig } from './types';
import ApiBuilderService from './ApiBuilderService';

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

export default class ApiBuilderInvocationForm {
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
    return (this.config.imported_services || []).map((importedService) => (
      new ApiBuilderService(importedService)
    ));
  }

  get userAgent() {
    return this.config.user_agent;
  }
}
