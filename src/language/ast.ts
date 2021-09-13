import includes from 'lodash/includes';
import ApiBuilderArray from '../type/ApiBuilderArray';
import ApiBuilderMap from '../type/ApiBuilderMap';
import ApiBuilderPrimitiveType from '../type/ApiBuilderPrimitiveType';
import type ApiBuilderService from '../type/ApiBuilderService';
import { ApiBuilderType } from '../type/types';
import { Regex, Kind } from './constants';
// eslint-disable-next-line import/no-cycle -- needs larger refactor to remove dependency cycle
import FullyQualifiedName from './FullyQualifiedName';

export interface Node {
  name: string;
}

export interface EnclosingTypeNode {
  name: string;
  type: Node | EnclosingTypeNode;
}

export type AstNode = Node | EnclosingTypeNode;

/**
 * Given the name of a type as it appears in an API builder schema, returns
 * whether it is a representation of an array type.
 * @example
 * isArrayTypeName("[string]");
 * //=> true
 * isArrayTypeName("string");
 * //=> false
 */
export function isArrayTypeName(type: string) {
  return Regex.ARRAYOF.test(type);
}

/**
 * Given the name of a type as it appears in an API builder schema, returns
 * whether it is a representation of a map type.
 * @example
 * isMapTypeName("map[string]");
 * //=> true
 * isMapTypeName("string");
 * //=> false
 */
export function isMapTypeName(type: string) {
  return Regex.OBJECTOF.test(type);
}

/**
 * Returns the type name for the specified API builder AST.
 * @example
 * typeNameFromAst({ name: "map", type: { name: "string" } });
 * //=> "map[string]"
 */
export function typeNameFromAst(ast: AstNode): string {
  if (ast.name === Kind.MAP) {
    return `map[${typeNameFromAst((<EnclosingTypeNode>ast).type)}]`;
  }

  if (ast.name === Kind.ARRAY) {
    return `[${typeNameFromAst((<EnclosingTypeNode>ast).type)}]`;
  }

  return ast.name;
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
  const mapMatch = type.match(Regex.OBJECTOF);
  if (mapMatch) {
    const [, $1] = mapMatch;
    return $1;
  }

  const arrayMatch = type.match(Regex.ARRAYOF);
  if (arrayMatch) {
    const [, $1] = arrayMatch;
    return $1;
  }

  return type;
}

/**
 * Produces an AST given the name of a type as it appears in an API builder schema.
 * Useful to construct concrete types from strings.
 * @example
 * astFromTypeName("string")
 * // => { name: "string" }
 * astFromTypeName("map[[string]]");
 * //=> { name: "map", type: { name: "array", type: { name: "string" } } }
 */
export function astFromTypeName(typeName: string): AstNode {
  switch (true) {
    case isMapTypeName(typeName):
      return {
        name: Kind.MAP,
        type: astFromTypeName(getNestedTypeName(typeName)),
      };
    case isArrayTypeName(typeName):
      return {
        name: Kind.ARRAY,
        type: astFromTypeName(getNestedTypeName(typeName)),
      };
    default:
      return {
        name: typeName,
      };
  }
}

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
 * Given the name of a type as it appears in an API builder schema, returns
 * whether its base type represents a primitive type.
 * @example
 * isPrimitiveTypeName("string");
 * //=> true
 * isPrimitiveTypeName("map[date_time_iso8601]");
 * // => true
 * isPrimitiveTypeName("[com.bryzek.spec.v0.models.reference]");
 * // => false
 */
export function isPrimitiveTypeName(type: string): boolean {
  return includes(
    [
      Kind.BOOLEAN,
      Kind.DATE_ISO8601,
      Kind.DATE_TIME_ISO8601,
      Kind.DECIMAL,
      Kind.DOUBLE,
      Kind.INTEGER,
      Kind.JSON,
      Kind.LONG,
      Kind.OBJECT,
      Kind.STRING,
      Kind.UNIT,
      Kind.UUID,
    ],
    getBaseTypeName(type),
  );
}

/**
 * Returns the API builder type from the specified API builder AST.
 * Types are resolved from the provided service unless it is primitive type.
 * When resolving types, internal types will take precedence over external
 * types. That being said, using a type short name to construct the AST is
 * unreliable. For best results, use a fully qualified name to construct the
 * AST instead.
 */
export function typeFromAst(ast: AstNode, service: ApiBuilderService): ApiBuilderType {
  if (ast.name === Kind.MAP) {
    return new ApiBuilderMap(typeFromAst((<EnclosingTypeNode>ast).type, service));
  }

  if (ast.name === Kind.ARRAY) {
    return new ApiBuilderArray(typeFromAst((<EnclosingTypeNode>ast).type, service));
  }

  if (isPrimitiveTypeName(ast.name)) {
    return new ApiBuilderPrimitiveType(new FullyQualifiedName(ast.name));
  }

  const type = service.findTypeByName(ast.name);

  if (type == null) {
    throw new Error(`${ast.name} is not a type defined in ${String(service)} service.`);
  }

  return type;
}
