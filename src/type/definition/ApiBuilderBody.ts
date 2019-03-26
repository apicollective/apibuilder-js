import { ApiBuilderAttributeConfig } from './ApiBuilderAttribute';
import { ApiBuilderDeprecationConfig } from './ApiBuilderDeprecation';
import { ApiBuilderService } from './ApiBuilderService';
import { astFromTypeName, typeFromAst } from '../../language';

/**
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-body
 */
export interface ApiBuilderBodyConfig {
  readonly type: string;
  readonly description?: string;
  readonly deprecation?: ApiBuilderDeprecationConfig;
  readonly attributes: ReadonlyArray<ApiBuilderAttributeConfig>;
}

export class ApiBuilderBody {
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
    if (this.config.description) {
      return this.config.description;
    }
  }

  get isDeprecated() {
    return this.config.deprecation != null;
  }
}
