import invariant from 'invariant';
import { FullyQualifiedName } from '../../language';

export class ApiBuilderPrimitiveType {
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
}
