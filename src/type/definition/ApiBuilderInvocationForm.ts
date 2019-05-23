import { ApiBuilderServiceConfig, ApiBuilderService } from './ApiBuilderService';

export interface ApiBuilderInvocationFormConfig {
  attributes: ({ name: string, value: string })[];
  service: ApiBuilderServiceConfig;
  imported_services?: ApiBuilderServiceConfig[];
  user_agent?: string;
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
