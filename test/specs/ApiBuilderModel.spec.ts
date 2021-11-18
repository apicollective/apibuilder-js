import keyBy from 'lodash/keyBy';

import { ApiBuilderModel, ApiBuilderService } from '../../src';
import apidocApi from '../fixtures/apidocApi';

const service = new ApiBuilderService(apidocApi);
const models = keyBy(apidocApi.models, 'name');

describe('ApiBuilderModel', () => {
  test('should have property with base type name', () => {
    const model = ApiBuilderModel.fromConfig(models.application, service);
    expect(model).toHaveProperty('baseTypeName', 'com.bryzek.apidoc.api.v0.models.application');
  });

  test('should have property with package name', () => {
    const model = ApiBuilderModel.fromConfig(models.application, service);
    expect(model).toHaveProperty('packageName', 'com.bryzek.apidoc.api.v0.models');
  });

  test('should have property with attributes', () => {
    const model = ApiBuilderModel.fromConfig(models.application, service);
    expect(model).toHaveProperty('attributes', []);
  });
});
