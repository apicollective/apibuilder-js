import pickBy from 'lodash/pickBy';
import values from 'lodash/values';

import { FullyQualifiedName, Kind, isPrimitiveTypeName } from '../../src';

const primitiveTypes = values(pickBy(Kind, isPrimitiveTypeName));
const baseTypeName = 'com.bryzek.apidoc.common.v0.models.reference';

describe('FullyQualifiedName::baseTypeName', () => {
  primitiveTypes.forEach((primitiveType) => {
    test(`should be "${primitiveType}" for instance of type "${primitiveType}"`, () => {
      const instance = new FullyQualifiedName(primitiveType);
      expect(instance).toHaveProperty('baseTypeName', primitiveType);
    });

    test(`should be "${primitiveType}" for instance of type "[${primitiveType}]"`, () => {
      const instance = new FullyQualifiedName(`[${primitiveType}]`);
      expect(instance).toHaveProperty('baseTypeName', primitiveType);
    });

    test(`should be "${primitiveType}" for instance of type "map[${primitiveType}]"`, () => {
      const instance = new FullyQualifiedName(`map[${primitiveType}]`);
      expect(instance).toHaveProperty('baseTypeName', primitiveType);
    });
  });

  test(`should be "${baseTypeName}" for instance of type "${baseTypeName}"`, () => {
    const instance = new FullyQualifiedName(baseTypeName);
    expect(instance).toHaveProperty('baseTypeName', baseTypeName);
  });

  test(`should be "${baseTypeName}" for instance of type "[${baseTypeName}]"`, () => {
    const instance = new FullyQualifiedName(`[${baseTypeName}]`);
    expect(instance).toHaveProperty('baseTypeName', baseTypeName);
  });

  test(`should be "${baseTypeName}" for instance of type "map[${baseTypeName}]"`, () => {
    const instance = new FullyQualifiedName(`map[${baseTypeName}]`);
    expect(instance).toHaveProperty('baseTypeName', baseTypeName);
  });
});

describe('FullyQualifiedName::nestedTypeName', () => {
  test('should be "string" for instance of type "map[string]"', () => {
    const instance = new FullyQualifiedName('map[string]');
    expect(instance).toHaveProperty('nestedTypeName', 'string');
  });

  test('should be "string" for instance of type "[string]"', () => {
    const instance = new FullyQualifiedName('[string]');
    expect(instance).toHaveProperty('nestedTypeName', 'string');
  });

  test('should be "[string]" for instance of type "map[[string]]"', () => {
    const instance = new FullyQualifiedName('map[[string]]');
    expect(instance).toHaveProperty('nestedTypeName', '[string]');
  });

  test('should be "io.flow.v0.models.experience" for instance of type "[io.flow.v0.models.experience]"', () => {
    const instance = new FullyQualifiedName('[io.flow.v0.models.experience]');
    expect(instance).toHaveProperty('nestedTypeName', 'io.flow.v0.models.experience');
  });

  test('should be "io.flow.v0.models.experience" for instance of type "map[io.flow.v0.models.experience]"', () => {
    const instance = new FullyQualifiedName('map[io.flow.v0.models.experience]');
    expect(instance).toHaveProperty('nestedTypeName', 'io.flow.v0.models.experience');
  });

  test('should be "string" for instance of type "string"', () => {
    const instance = new FullyQualifiedName('string');
    expect(instance).toHaveProperty('nestedTypeName', 'string');
  });

  test('should be "io.flow.v0.models.experience" for instance of type "io.flow.v0.models.experience"', () => {
    const instance = new FullyQualifiedName('io.flow.v0.models.experience');
    expect(instance).toHaveProperty('nestedTypeName', 'io.flow.v0.models.experience');
  });
});

describe('FullyQualifiedName::shortName', () => {
  primitiveTypes.forEach((primitiveType) => {
    test(`should be "${primitiveType}" for instance of type "${primitiveType}"`, () => {
      const instance = new FullyQualifiedName(primitiveType);
      expect(instance).toHaveProperty('shortName', primitiveType);
    });

    test(`should be "${primitiveType}" for instance of type "[${primitiveType}]"`, () => {
      const instance = new FullyQualifiedName(`[${primitiveType}]`);
      expect(instance).toHaveProperty('shortName', primitiveType);
    });

    test(`should be "${primitiveType}" for instance of type "map[${primitiveType}]"`, () => {
      const instance = new FullyQualifiedName(`map[${primitiveType}]`);
      expect(instance).toHaveProperty('shortName', primitiveType);
    });
  });

  test(`should be "${baseTypeName}" for instance of type "${baseTypeName}"`, () => {
    const instance = new FullyQualifiedName(baseTypeName);
    expect(instance).toHaveProperty('shortName', 'reference');
  });

  test(`should be "${baseTypeName}" for instance of type "[${baseTypeName}]"`, () => {
    const instance = new FullyQualifiedName(`[${baseTypeName}]`);
    expect(instance).toHaveProperty('shortName', 'reference');
  });

  test(`should be "${baseTypeName}" for instance of type "map[${baseTypeName}]"`, () => {
    const instance = new FullyQualifiedName(`map[${baseTypeName}]`);
    expect(instance).toHaveProperty('shortName', 'reference');
  });
});

describe('FullyQualifiedName::packageName', () => {
  primitiveTypes.forEach((primitiveType) => {
    test(`should be empty string for instance of type "${primitiveType}"`, () => {
      const instance = new FullyQualifiedName(primitiveType);
      expect(instance).toHaveProperty('packageName', '');
    });

    test(`should be empty string for instance of type "[${primitiveType}]"`, () => {
      const instance = new FullyQualifiedName(`[${primitiveType}]`);
      expect(instance).toHaveProperty('packageName', '');
    });

    test(`should be empty string for instance of type "map[${primitiveType}]"`, () => {
      const instance = new FullyQualifiedName(`map[${primitiveType}]`);
      expect(instance).toHaveProperty('packageName', '');
    });
  });

  test(`should be "com.bryzek.apidoc.common.v0.models" for instance of type "${baseTypeName}"`, () => {
    const instance = new FullyQualifiedName(baseTypeName);
    expect(instance).toHaveProperty('packageName', 'com.bryzek.apidoc.common.v0.models');
  });

  test(`should be "com.bryzek.apidoc.common.v0.models" for instance of type "[${baseTypeName}]"`, () => {
    const instance = new FullyQualifiedName(`[${baseTypeName}]`);
    expect(instance).toHaveProperty('packageName', 'com.bryzek.apidoc.common.v0.models');
  });

  test(`should be "com.bryzek.apidoc.common.v0.models" for instance of type "map[${baseTypeName}]"`, () => {
    const instance = new FullyQualifiedName(`map[${baseTypeName}]`);
    expect(instance).toHaveProperty('packageName', 'com.bryzek.apidoc.common.v0.models');
  });
});

describe('FullyQualifiedName::isArrayType', () => {
  test('should be true for instance of type "[string]"', () => {
    const instance = new FullyQualifiedName('[string]');
    expect(instance).toHaveProperty('isArrayType', true);
  });

  test(`should be true for instance of type [${baseTypeName}]`, () => {
    const instance = new FullyQualifiedName(`[${baseTypeName}]`);
    expect(instance).toHaveProperty('isArrayType', true);
  });

  test('should be false for instance of type "string"', () => {
    const instance = new FullyQualifiedName('string');
    expect(instance).toHaveProperty('isArrayType', false);
  });

  test(`should be true for instance of type ${baseTypeName}`, () => {
    const instance = new FullyQualifiedName(`${baseTypeName}`);
    expect(instance).toHaveProperty('isArrayType', false);
  });
});

describe('FullyQualifiedName::isMapType', () => {
  test('should be true for instance of type "map[string]"', () => {
    const instance = new FullyQualifiedName('map[string]');
    expect(instance).toHaveProperty('isMapType', true);
  });

  test(`should be true for instance of type map[${baseTypeName}]`, () => {
    const instance = new FullyQualifiedName(`map[${baseTypeName}]`);
    expect(instance).toHaveProperty('isMapType', true);
  });

  test('should be false for instance of type "string"', () => {
    const instance = new FullyQualifiedName('string');
    expect(instance).toHaveProperty('isMapType', false);
  });

  test(`should be true for instance of type ${baseTypeName}`, () => {
    const instance = new FullyQualifiedName(`${baseTypeName}`);
    expect(instance).toHaveProperty('isMapType', false);
  });
});

describe('FullyQualifiedName::isEnclosingType', () => {
  test('should be true for instance of type "map[string]"', () => {
    const instance = new FullyQualifiedName('map[string]');
    expect(instance).toHaveProperty('isEnclosingType', true);
  });

  test('should be true for instance of type "[string]"', () => {
    const instance = new FullyQualifiedName('[string]');
    expect(instance).toHaveProperty('isEnclosingType', true);
  });

  test('should be true for instance of type "map[[string]]"', () => {
    const instance = new FullyQualifiedName('map[[string]]');
    expect(instance).toHaveProperty('isEnclosingType', true);
  });

  test('should be true for instance of type "[io.flow.v0.models.experience]"', () => {
    const instance = new FullyQualifiedName('[io.flow.v0.models.experience]');
    expect(instance).toHaveProperty('isEnclosingType', true);
  });

  test('should be true for instance of type "map[io.flow.v0.models.experience]"', () => {
    const instance = new FullyQualifiedName('map[io.flow.v0.models.experience]');
    expect(instance).toHaveProperty('isEnclosingType', true);
  });

  test('should be false for instance of type "string"', () => {
    const instance = new FullyQualifiedName('string');
    expect(instance).toHaveProperty('isEnclosingType', false);
  });

  test('should be false for instance of type "io.flow.v0.models.experience"', () => {
    const instance = new FullyQualifiedName('io.flow.v0.models.experience');
    expect(instance).toHaveProperty('isEnclosingType', false);
  });
});

describe('FullyQualifiedName::isPrimitiveType', () => {
  primitiveTypes.forEach((primitiveType) => {
    test(`should be true for an instance of type "${primitiveType}"`, () => {
      const instance = new FullyQualifiedName(primitiveType);
      expect(instance).toHaveProperty('isPrimitiveType', true);
    });

    test(`should be true for an instance of type "[${primitiveType}]"`, () => {
      const instance = new FullyQualifiedName(`[${primitiveType}]`);
      expect(instance).toHaveProperty('isPrimitiveType', true);
    });

    test(`should be true for an instance of type "map[${primitiveType}]"`, () => {
      const instance = new FullyQualifiedName(`map[${primitiveType}]`);
      expect(instance).toHaveProperty('isPrimitiveType', true);
    });
  });

  test(`should be false for an instance of type "${baseTypeName}"`, () => {
    const instance = new FullyQualifiedName(baseTypeName);
    expect(instance).toHaveProperty('isPrimitiveType', false);
  });

  test(`should be false for an instance of type "[${baseTypeName}]"`, () => {
    const instance = new FullyQualifiedName(`[${baseTypeName}]`);
    expect(instance).toHaveProperty('isPrimitiveType', false);
  });

  test(`should be false for an instance of type "map[${baseTypeName}]"`, () => {
    const instance = new FullyQualifiedName(`map[${baseTypeName}]`);
    expect(instance).toHaveProperty('isPrimitiveType', false);
  });
});
