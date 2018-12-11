import faker from 'faker';
import keyBy from 'lodash/keyBy';

import { ApiBuilderEnum, ApiBuilderEnumValue, ApiBuilderService } from '../../src';
import { createMockDeprecation, createMockEnum } from '../helpers/mocks';
import apidocApiJson from '../fixtures/apidoc-api.json';

const service = new ApiBuilderService(apidocApiJson);
const enumerations = keyBy(apidocApiJson.enums, 'name');

describe('ApiBuilderEnum', () => {
  test('should have static function to create enumeration from schema declaration', () => {
    const instance = ApiBuilderEnum.fromConfig(enumerations.visibility, service);
    expect(instance).toBeInstanceOf(ApiBuilderEnum);
  });

  test('should define enum type with values', () => {
    const instance = ApiBuilderEnum.fromConfig(enumerations.visibility, service);
    instance.values.forEach((value) => {
      expect(value).toBeInstanceOf(ApiBuilderEnumValue);
    });
  });

  test('should have pascal case nickname', () => {
    const instance = ApiBuilderEnum.fromConfig(enumerations.original_type, service);
    expect(instance).toHaveProperty('nickname', 'OriginalType');
  });

  test('should be deprecated', () => {
    const enumeration = createMockEnum({ deprecation: createMockDeprecation() });
    const instance = ApiBuilderEnum.fromConfig(enumeration, service);
    expect(instance).toHaveProperty('isDeprecated', true);
  });

  test('should not be deprecated', () => {
    const enumeration = createMockEnum();
    const instance = ApiBuilderEnum.fromConfig(enumeration, service);
    expect(instance).toHaveProperty('isDeprecated', false);
  });

  test('should have deprecation reason', () => {
    const deprecationReason = faker.lorem.sentence();
    const enumeration = createMockEnum({
      deprecation: createMockDeprecation({
        description: deprecationReason,
      }),
    });
    const instance = ApiBuilderEnum.fromConfig(enumeration, service);
    expect(instance).toHaveProperty('deprecationReason', deprecationReason);
  });

  test('should define other properties from enum schema', () => {
    const instance = ApiBuilderEnum.fromConfig(enumerations.visibility, service);
    expect(instance).toHaveProperty('name', enumerations.visibility.name);
    expect(instance).toHaveProperty('plural', enumerations.visibility.plural);
    expect(instance).toHaveProperty('description', enumerations.visibility.description);
    expect(instance).toHaveProperty('attributes', enumerations.visibility.attributes);
  });
});
