import faker from 'faker';

import { ApiBuilderEnumValue } from '../../src';
import { createMockDeprecation, createMockEnumValue } from '../helpers/mocks';

describe('ApiBuilderEnumValue', () => {
  test('should accept well defined enum value schema', () => {
    const config = createMockEnumValue({
      description: faker.lorem.sentence(),
    });
    const instance = new ApiBuilderEnumValue(config);
    expect(instance).toHaveProperty('name', config.name);
    expect(instance).toHaveProperty('description', config.description);
    expect(instance).toHaveProperty('attributes', config.attributes);
    expect(instance).toHaveProperty('deprecation', config.deprecation);
  });

  test('should have constant case nickname', () => {
    const config = createMockEnumValue({ name: 'no_remaining_balance' });
    const instance = new ApiBuilderEnumValue(config);
    expect(instance).toHaveProperty('nickname', 'NO_REMAINING_BALANCE');
  });

  test('should not be deprecated', () => {
    const config = createMockEnumValue();
    const instance = new ApiBuilderEnumValue(config);
    expect(instance).toHaveProperty('isDeprecated', false);
  });

  test('should be deprecated', () => {
    const config = createMockEnumValue({
      deprecation: createMockDeprecation(),
    });
    const instance = new ApiBuilderEnumValue(config);
    expect(instance).toHaveProperty('isDeprecated', true);
  });

  test('should have deprecation reason', () => {
    const deprecationReason = faker.lorem.sentence();
    const config = createMockEnumValue({
      deprecation: createMockDeprecation({
        description: deprecationReason,
      }),
    });
    const instance = new ApiBuilderEnumValue(config);
    expect(instance).toHaveProperty('deprecationReason', deprecationReason);
  });
});
