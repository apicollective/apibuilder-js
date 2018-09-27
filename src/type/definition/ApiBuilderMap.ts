import { ApiBuilderType } from './ApiBuilderType';

/**
 * A map is an enclosing type which points to another type.
 * Maps are often created within the context of defining the fields of
 * a model type.
 */
export class ApiBuilderMap {
  public ofType: ApiBuilderType;

  constructor(ofType: ApiBuilderType) {
    this.ofType = ofType;
  }

  public toString() {
    return `map[${String(this.ofType)}]`;
  }
}
