import {
  ApiBuilderArray,
  ApiBuilderEnum,
  ApiBuilderMap,
  ApiBuilderModel,
  ApiBuilderPrimitiveType,
  ApiBuilderUnion,
} from '.';

export type ApiBuilderEnclosingType =
  | ApiBuilderArray
  | ApiBuilderMap;

export type ApiBuilderType =
  | ApiBuilderPrimitiveType
  | ApiBuilderArray
  | ApiBuilderMap
  | ApiBuilderModel
  | ApiBuilderEnum
  | ApiBuilderUnion;
