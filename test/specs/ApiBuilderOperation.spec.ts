import { ApiBuilderService } from '../../src';
import apidocApiJson from '../fixtures/apidoc-api.json';

describe('ApiBuilderOperation', () => {
  describe('#getResponseTypeByCode', () => {
    test('returns type matching response code', () => {
      const service = new ApiBuilderService(apidocApiJson);
      const resource = service.resources
        .find(resource => resource.typeName === 'application');
      const operation = resource.operations
        .find(operation => operation.path === '/:orgKey' && operation.method === 'GET');
      const type = operation.getResponseTypeByCode(200);
      expect(type.toString()).toEqual('[com.bryzek.apidoc.api.v0.models.application]');
    });
  });
});
