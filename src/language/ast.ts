import { ApiBuilderArray, ApiBuilderMap, ApiBuilderPrimitiveType, ApiBuilderService, ApiBuilderType } from '../type';
import { FullyQualifiedName, Kind, getNestedTypeName, isArrayTypeName, isMapTypeName, isPrimitiveTypeName } from '../language';

export interface Node {
  name: string;
}

export interface EnclosingTypeNode {
  name: string;
  type: Node | EnclosingTypeNode;
}

export type AstNode = Node | EnclosingTypeNode;

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
