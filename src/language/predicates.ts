/* eslint-disable import/no-cycle */

import { includes } from 'lodash';

import { Kind, Regex } from './constants';
import { getBaseTypeName } from './FullyQualifiedName';

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
