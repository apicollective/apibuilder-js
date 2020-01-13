import { ApiBuilderService } from '../../src';
import apidocApi from '../fixtures/apidoc-api';

const service = new ApiBuilderService(apidocApi);

describe('ApiBuilderService', () => {
  test('should have property with name', () => {
    expect(service).toHaveProperty('name', apidocApi.name);
  });

  test('should have property with organization key', () => {
    expect(service).toHaveProperty('organizationKey', apidocApi.organization.key);
  });

  test('should have property with namespace', () => {
    expect(service).toHaveProperty('namespace', apidocApi.namespace);
  });

  test('should have property with version', () => {
    expect(service).toHaveProperty('version', apidocApi.version);
  });
});
