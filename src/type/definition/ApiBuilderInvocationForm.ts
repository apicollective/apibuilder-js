import { InvocationForm } from '../../generated/types/apibuilder-generator';
import { ApiBuilderService } from './ApiBuilderService';

export class ApiBuilderInvocationForm {
  config: InvocationForm;

  constructor(config: InvocationForm) {
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
