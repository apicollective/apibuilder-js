import type { ApiBuilderType } from './types';

/**
 * A map is an enclosing type which points to another type.
 * Maps are often created within the context of defining the fields of
 * a model type.
 */
export default class ApiBuilderMap {
  public ofType: ApiBuilderType;

  constructor(ofType: ApiBuilderType) {
    this.ofType = ofType;
  }

  public toString() {
    return `map[${String(this.ofType)}]`;
  }

  /**
   * Returns whether the specified object is an API Builder map type.
   */
  static isInstanceOf(type: any): type is ApiBuilderMap {
    return type instanceof ApiBuilderMap;
  }
}
