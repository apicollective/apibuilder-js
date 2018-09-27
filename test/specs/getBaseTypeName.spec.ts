import pickBy from 'lodash/pickBy';
import values from 'lodash/values';

import { Kind, getBaseTypeName, isPrimitiveTypeName } from '../../src';

const primitiveTypes = values(pickBy(Kind, isPrimitiveTypeName));
const baseTypeName = 'com.bryzek.apidoc.common.v0.models.reference';

describe('getBaseTypeName', () => {
  primitiveTypes.forEach((primitiveType) => {
    test(`should return "${primitiveType}" for type "${primitiveType}"`, () => {
      expect(getBaseTypeName(primitiveType)).toBe(primitiveType);
    });

    test(`should return "${primitiveType}" for type "[${primitiveType}]"`, () => {
      expect(getBaseTypeName(`[${primitiveType}]`)).toBe(primitiveType);
    });

    test(`should return "${primitiveType}" for type "map[${primitiveType}]"`, () => {
      expect(getBaseTypeName(`map[${primitiveType}]`)).toBe(primitiveType);
    });
  });

  test(`should return "${baseTypeName}" for type "${baseTypeName}"`, () => {
    expect(getBaseTypeName(baseTypeName)).toBe(baseTypeName);
  });

  test(`should return "${baseTypeName}" for type "[${baseTypeName}]"`, () => {
    expect(getBaseTypeName(`[${baseTypeName}]`)).toBe(baseTypeName);
  });

  test(`should return "${baseTypeName}" for type "map[${baseTypeName}]"`, () => {
    expect(getBaseTypeName(`map[${baseTypeName}]`)).toBe(baseTypeName);
  });
});
