/* eslint-disable import/no-cycle */

import {
  ApiBuilderArray,
  ApiBuilderEnclosingType,
  ApiBuilderEnum,
  ApiBuilderMap,
  ApiBuilderModel,
  ApiBuilderPrimitiveType,
  ApiBuilderType,
  ApiBuilderUnion,
} from './definition';

/**
 * Returns whether the specified object is an API Builder enumeration type.
 */
export function isEnumType(type: unknown): type is ApiBuilderEnum {
  return type instanceof ApiBuilderEnum;
}

/**
 * Returns whether the specified object is an API Builder array type.
 */
export function isArrayType(type: unknown): type is ApiBuilderArray {
  return type instanceof ApiBuilderArray;
}

/**
 * Returns whether the specified object is an API Builder map type.
 */
export function isMapType(type: unknown): type is ApiBuilderMap {
  return type instanceof ApiBuilderMap;
}

/**
 * Returns whether the specified object is an API Builder model type.
 */
export function isModelType(type: unknown): type is ApiBuilderModel {
  return type instanceof ApiBuilderModel;
}

/**
 * Returns whether the specified object is an API Builder primitive type.
 */
export function isPrimitiveType(type: unknown): type is ApiBuilderPrimitiveType {
  return type instanceof ApiBuilderPrimitiveType;
}

/**
 * Returns whether the specified object is an API Builder union type.
 */
export function isUnionType(type: unknown): type is ApiBuilderUnion {
  return type instanceof ApiBuilderUnion;
}

/**
 * Returns whether the specified object is one of the possible
 * API Builder enclosing types.
 */
export function isEnclosingType(type: unknown): type is ApiBuilderEnclosingType {
  return isArrayType(type) || isMapType(type);
}

/**
 * Returns whether the specified object is one of the possible
 * API Builder types.
 */
export function isType(type: unknown): type is ApiBuilderType {
  return isArrayType(type)
    || isMapType(type)
    || isPrimitiveType(type)
    || isModelType(type)
    || isEnumType(type)
    || isUnionType(type);
}

/**
 * If a given type is an enclosing type, this recursively strips the enclosing
 * wrappers and returns the underlying type.
 */
export function getBaseType(
  type: ApiBuilderType,
): Exclude<ApiBuilderType, ApiBuilderEnclosingType> {
  if (isEnclosingType(type)) {
    return getBaseType(type.ofType);
  }

  return type;
}
