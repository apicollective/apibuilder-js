import faker from 'faker';
import defaultTo from 'lodash/defaultTo';
import {
  ApiBuilderDeprecationConfig,
  ApiBuilderEnumValueConfig,
  ApiBuilderEnumConfig,
  ApiBuilderFieldConfig,
  Kind,
} from '../../src';

export function createMockDeprecation(config: Partial<ApiBuilderDeprecationConfig> = {}): ApiBuilderDeprecationConfig {
  return {
    description: config.description,
  };
}

export function createMockEnumValue(config: Partial<ApiBuilderEnumValueConfig> = {}): ApiBuilderEnumValueConfig {
  return {
    name: defaultTo(config.name, faker.lorem.word()),
    description: config.description,
    deprecation: config.deprecation,
    attributes: defaultTo(config.attributes, []),
  };
}

export function createMockEnum(config: Partial<ApiBuilderEnumConfig> = {}): ApiBuilderEnumConfig {
  return {
    name: defaultTo(config.name, faker.lorem.word()),
    plural: defaultTo(config.plural, faker.lorem.word()),
    description: config.description,
    deprecation: config.deprecation,
    values: defaultTo(config.values, [createMockEnumValue()]),
    attributes: defaultTo(config.attributes, []),
  };
}

export function createMockField(config: Partial<ApiBuilderFieldConfig> = {}): ApiBuilderFieldConfig {
  return {
    name: defaultTo(config.name, faker.lorem.word()),
    type: defaultTo(config.type, Kind.STRING),
    description: config.description,
    required: defaultTo(config.required, true),
    default: config.default,
    example: config.example,
    minimum: config.minimum,
    maximum: config.maximum,
    attributes: defaultTo(config.attributes, []),
    deprecation: config.deprecation,
  };
}
