import { Body } from '../../generated/types/apibuilder-spec';
import { ApiBuilderService } from './ApiBuilderService';
import { astFromTypeName, typeFromAst } from '../../language';

export class ApiBuilderBody {
  private config: Body;
  private service: ApiBuilderService;

  constructor(
    config: Body,
    service: ApiBuilderService,
  ) {
    this.config = config;
    this.service = service;
  }

  get type() {
    return typeFromAst(astFromTypeName(this.config.type), this.service);
  }

  get description() {
    if (this.config.description) {
      return this.config.description;
    }
  }

  get isDeprecated() {
    return this.config.deprecation != null;
  }
}
