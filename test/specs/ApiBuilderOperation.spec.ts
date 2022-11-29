import { ApiBuilderService } from '../../src';
import apidocApi from '../fixtures/apidocApi';

describe('ApiBuilderOperation', () => {
  describe('#getResponseTypeByCode', () => {
    test('returns type matching response code', () => {
      const service = new ApiBuilderService(apidocApi);
      const resource = service.resources
        .find((_) => _.typeName === 'application');
      const operation = resource?.operations
        .find((_) => _.path === '/:orgKey' && _.method === 'GET');
      const type = operation?.getResponseTypeByCode(200);
      expect(type?.toString()).toBe('[com.bryzek.apidoc.api.v0.models.application]');
    });
  });
});
