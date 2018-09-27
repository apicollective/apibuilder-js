import faker from 'faker';

import { ApiBuilderField, ApiBuilderService } from '../../src';
import { createMockDeprecation, createMockField } from '../helpers/mocks';
import apidocApiJson from '../fixtures/apidoc-api.json';

const service = new ApiBuilderService(apidocApiJson);

describe('ApiBuilderField', () => {
  test('should have property with field name', () => {
    const config = createMockField({ type: 'visibility' });
    const field = new ApiBuilderField(config, service);
    expect(field).toHaveProperty('name', config.name);
  });

  test('should have property indicating whether field is required', () => {
    const config = createMockField({ type: 'visibility' });
    const field = new ApiBuilderField(config, service);
    expect(field).toHaveProperty('isRequired', true);
  });

  test('should have property with field type', () => {
    const config = createMockField({ type: 'visibility' });
    const field = new ApiBuilderField(config, service);
    expect(field).toHaveProperty('type.baseTypeName', 'com.bryzek.apidoc.api.v0.enums.visibility');
    expect(field).toHaveProperty('type.packageName', 'com.bryzek.apidoc.api.v0.enums');
  });

  test('should have property with field deprecation reason', () => {
    const deprecationReason = faker.lorem.sentence();
    const config = createMockField({
      type: 'visibility',
      deprecation: createMockDeprecation({
        description: deprecationReason,
      }),
    });
    const field = new ApiBuilderField(config, service);
    expect(field).toHaveProperty('deprecationReason', deprecationReason);
  });
});
