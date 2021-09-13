import type { ApiBuilderBodyConfig } from './types';
import { typeFromAst, astFromTypeName } from '../language/ast';
import type ApiBuilderService from './ApiBuilderService';

export default class ApiBuilderBody {
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
