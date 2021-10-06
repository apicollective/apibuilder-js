/* eslint-disable import/no-cycle */

import invariant from 'invariant';
import { AstNode, EnclosingTypeNode, astFromTypeName } from './ast';
import { Regex } from './constants';
import { isArrayTypeName, isMapTypeName, isPrimitiveTypeName } from './predicates';

/**
 * API Builder types can be complex (e.g. array of strings, map of strings,
 * maps of array of strings etc.). By design, all entries in an array or map
 * must be of the same type: this is called the base type.
 * @example
 * getBaseTypeName("map[string]")
 * //=> "string"
 * getBaseTypeName("map[[string]]")
 * //=> "string"
 */
export function getBaseTypeName(type: string | AstNode): string {
  if (typeof type === 'string') {
    return getBaseTypeName(astFromTypeName(type));
  }

  if ((<EnclosingTypeNode>type).type) {
    return getBaseTypeName((<EnclosingTypeNode>type).type);
  }

  return type.name;
}

/**
 * Given the name of an enclosing type as it appears in an API builder schema,
 * returns the API builder type name of the underlying type.
 * @example
 * getNestedTypeName("map[string]");
 * //=> "string"
 * getNestedTypeName("map[[string]]");
 * //=> "[string]"
 */
export function getNestedTypeName(type: string): string {
  const mapMatch = Regex.OBJECTOF.exec(type);
  if (mapMatch) {
    const [, $1] = mapMatch;
    return $1;
  }

  const arrayMatch = Regex.ARRAYOF.exec(type);
  if (arrayMatch) {
    const [, $1] = arrayMatch;
    return $1;
  }

  return type;
}

export function isFullyQualifiedName(identifier: string): boolean {
  return isPrimitiveTypeName(identifier) || getBaseTypeName(identifier).lastIndexOf('.') >= 0;
}

export function assertFullyQualifiedName(fullyQualifiedName: string): void {
  invariant(
    isFullyQualifiedName(fullyQualifiedName),
    `"${fullyQualifiedName}" is not a valid fully qualified name. `
    + 'A fully qualified name may be the name of a primitive type, '
    + 'or a string consisting of a package name followed by the base '
    + 'short name. (e.g. "com.bryzek.apidoc.common.v0.models.reference").',
  );
}

export class FullyQualifiedName {
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
