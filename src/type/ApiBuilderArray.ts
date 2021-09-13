import { ApiBuilderType } from './types';

/**
 * An array is an enclosing type which points to another type.
 * Arrays are often created within the context of defining the fields of
 * a model type.
 */
export default class ApiBuilderArray {
  public ofType: ApiBuilderType;

  constructor(ofType: ApiBuilderType) {
    this.ofType = ofType;
  }

  public toString() {
    return `[${String(this.ofType)}]`;
  }

  /**
   * Returns whether the specified object is an API Builder array type.
   */
  static isInstanceOf(type: any): type is ApiBuilderArray {
    return type instanceof ApiBuilderArray;
  }
}
