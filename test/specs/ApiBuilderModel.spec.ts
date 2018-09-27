import keyBy from 'lodash/keyBy';

import { ApiBuilderModel, ApiBuilderService } from '../../src';
import apidocApiJson from '../fixtures/apidoc-api.json';

const service = new ApiBuilderService(apidocApiJson);
const models = keyBy(apidocApiJson.models, 'name');

describe('ApiBuilderModel', () => {
  test('should have property with base type name', () => {
    const model = ApiBuilderModel.fromConfig(models.application, service);
    expect(model).toHaveProperty('baseTypeName', 'com.bryzek.apidoc.api.v0.models.application');
  });

  test('should have property with package name', () => {
    const model = ApiBuilderModel.fromConfig(models.application, service);
    expect(model).toHaveProperty('packageName', 'com.bryzek.apidoc.api.v0.models');
  });
});
