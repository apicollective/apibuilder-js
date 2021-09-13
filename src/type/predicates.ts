import type { ApiBuilderEnclosingType, ApiBuilderType } from './types';
import ApiBuilderArray from './ApiBuilderArray';
import ApiBuilderEnum from './ApiBuilderEnum';
import ApiBuilderMap from './ApiBuilderMap';
import ApiBuilderModel from './ApiBuilderModel';
import ApiBuilderPrimitiveType from './ApiBuilderPrimitiveType';
import ApiBuilderUnion from './ApiBuilderUnion';

/**
 * Returns whether the specified object is one of the possible
 * API Builder enclosing types.
 */
export function isEnclosingType(type: any): type is ApiBuilderEnclosingType {
  return (
    ApiBuilderArray.isInstanceOf(type)
    || ApiBuilderMap.isInstanceOf(type)
  );
}

/**
 * Returns whether the specified object is one of the possible
 * API Builder types.
 */
export function isType(type: any): type is ApiBuilderType {
  return (
    ApiBuilderArray.isInstanceOf(type)
    || ApiBuilderMap.isInstanceOf(type)
    || ApiBuilderPrimitiveType.isInstanceOf(type)
    || ApiBuilderModel.isInstanceOf(type)
    || ApiBuilderEnum.isInstanceOf(type)
    || ApiBuilderUnion.isInstanceOf(type)
  );
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
