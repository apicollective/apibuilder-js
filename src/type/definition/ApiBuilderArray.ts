import { ApiBuilderType } from './ApiBuilderType';

/**
 * An array is an enclosing type which points to another type.
 * Arrays are often created within the context of defining the fields of
 * a model type.
 */
export class ApiBuilderArray {
  public ofType: ApiBuilderType;

  constructor(ofType: ApiBuilderType) {
    this.ofType = ofType;
  }

  public toString(): string {
    return `[${String(this.ofType)}]`;
  }
}
