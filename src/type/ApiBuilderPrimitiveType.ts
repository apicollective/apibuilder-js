import invariant from 'invariant';
import type FullyQualifiedName from '../language/FullyQualifiedName';

export default class ApiBuilderPrimitiveType {
  private fullyQualifiedName: FullyQualifiedName;

  constructor(fullyQualifiedName: FullyQualifiedName) {
    invariant(
      fullyQualifiedName.isPrimitiveType,
      `${String(fullyQualifiedName)} is not an API builder primitive type.`,
    );

    this.fullyQualifiedName = fullyQualifiedName;
  }

  get fullName() {
    return this.fullyQualifiedName.fullName;
  }

  get baseTypeName() {
    return this.fullyQualifiedName.baseTypeName;
  }

  get shortName() {
    return this.fullyQualifiedName.shortName;
  }

  get packageName() {
    return this.fullyQualifiedName.packageName;
  }

  get typeName() {
    return this.fullyQualifiedName.fullName;
  }

  public toString() {
    return this.baseTypeName;
  }

  /**
   * Returns whether the specified object is an API Builder primitive type.
   */
  static isInstanceOf(type: any): type is ApiBuilderPrimitiveType {
    return type instanceof ApiBuilderPrimitiveType;
  }
}
