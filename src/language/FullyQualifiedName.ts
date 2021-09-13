import invariant from 'invariant';
// eslint-disable-next-line import/no-cycle -- needs larger refactor to remove dependency cycle
import {
  isPrimitiveTypeName,
  getBaseTypeName,
  getNestedTypeName,
  isArrayTypeName,
  isMapTypeName,
} from './ast';

export function isFullyQualifiedName(identifier: string) {
  return isPrimitiveTypeName(identifier) || getBaseTypeName(identifier).lastIndexOf('.') >= 0;
}

export function assertFullyQualifiedName(fullyQualifiedName: string) {
  invariant(
    isFullyQualifiedName(fullyQualifiedName),
    `"${fullyQualifiedName}" is not a valid fully qualified name. `
    + 'A fully qualified name may be the name of a primitive type, '
    + 'or a string consisting of a package name followed by the base '
    + 'short name. (e.g. "com.bryzek.apidoc.common.v0.models.reference").',
  );
}

export default class FullyQualifiedName {
  /**
   * The fully qualified name of the type, including its package name.
   */
  public fullyQualifiedName: string;

  /**
   * Create a fully qualified type.
   * @example
   * new FullyQualifiedName("string");
   * new FullyQualifiedName("[string]");
   * new FullyQualifiedName("map[string]");
   * new FullyQualifiedName("com.bryzek.apidoc.common.v0.models.reference");
   * new FullyQualifiedName("[com.bryzek.apidoc.common.v0.models.reference]");
   * new FullyQualifiedName("map[com.bryzek.apidoc.common.v0.models.reference]");
   */
  constructor(fullyQualifiedName: string) {
    assertFullyQualifiedName(fullyQualifiedName);
    this.fullyQualifiedName = fullyQualifiedName;
  }

  /**
   * This property holds the fully qualified name of the type,
   * including its namespace.
   */
  get fullName() {
    return this.fullyQualifiedName;
  }

  /**
   * This property holds the base name of the type.
   */
  get baseTypeName() {
    return getBaseTypeName(this.fullyQualifiedName);
  }

  /**
   * This property holds the nested type. A nested type is a type defined
   * within the scope of another type, which is called the enclosing type.
   * Only array or map types can enclose another type, which may be any of the
   * supported API builder types, including another array or map.
   */
  get nestedTypeName() {
    return getNestedTypeName(this.fullyQualifiedName);
  }

  /**
   * This property holds the base short name, that is the type name
   * without its package name.
   */
  get shortName() {
    const lastIndex = this.baseTypeName.lastIndexOf('.');

    if (lastIndex === -1) {
      return this.baseTypeName;
    }

    return this.baseTypeName.substring(lastIndex + 1);
  }

  /**
   * This property holds the package name.
   */
  get packageName() {
    const lastIndex = this.baseTypeName.lastIndexOf('.');

    if (this.isPrimitiveType || lastIndex === -1) {
      return '';
    }

    return this.baseTypeName.substring(0, lastIndex);
  }

  /**
   * This property holds whether this is an array.
   */
  get isArrayType() {
    return isArrayTypeName(this.fullyQualifiedName);
  }

  /**
   * This property holds whether this is a map.
   */
  get isMapType() {
    return isMapTypeName(this.fullyQualifiedName);
  }

  /**
   * This property holds whether this type is an enclosing type. An enclosing
   * type is a type that encloses another type, which is called the nested type.
   * Only array or map types can enclose another type, which may be one of the
   * supported API builder types, including another array or map.
   */
  get isEnclosingType() {
    return this.isArrayType || this.isMapType;
  }

  /**
   * This property holds whether this is a primitive type.
   */
  get isPrimitiveType() {
    return isPrimitiveTypeName(this.fullName);
  }

  public toString() {
    return this.fullyQualifiedName;
  }
}
