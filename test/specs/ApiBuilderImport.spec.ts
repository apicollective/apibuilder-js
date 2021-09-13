import keyBy from 'lodash/keyBy';
import {
  ApiBuilderImport,
  ApiBuilderService,
  ApiBuilderEnum,
  ApiBuilderModel,
  ApiBuilderUnion,
} from '../../src';
import apidocApi from '../fixtures/apidocApi';

const service = new ApiBuilderService(apidocApi);
const imports = keyBy(apidocApi.imports, 'namespace');
const subject = new ApiBuilderImport(imports['com.bryzek.apidoc.spec.v0'], service);

describe('ApiBuilderImport', () => {
  test('should have properties from schema', () => {
    expect(subject).toHaveProperty('namespace', 'com.bryzek.apidoc.spec.v0');
    expect(subject).toHaveProperty('organizationKey', 'bryzek');
    expect(subject).toHaveProperty('applicationKey', 'apidoc-spec');
    expect(subject).toHaveProperty('version', '0.11.94');
  });

  test('should have properties with types from specified schema', () => {
    expect(subject.enums.every(ApiBuilderEnum.isInstanceOf)).toBe(true);
    expect(subject.models.every(ApiBuilderModel.isInstanceOf)).toBe(true);
    expect(subject.unions.every(ApiBuilderUnion.isInstanceOf)).toBe(true);
  });
});

describe('ApiBuilderImport::findEnumByName', () => {
  test('should return type matching short name', () => {
    expect(ApiBuilderEnum.isInstanceOf(subject.findEnumByName('parameter_location'))).toBe(true);
  });

  test('should return type matching fully qualified name', () => {
    expect(ApiBuilderEnum.isInstanceOf(subject.findEnumByName('com.bryzek.apidoc.spec.v0.enums.parameter_location'))).toBe(true);
  });
});

describe('ApiBuilderImport::findModelByName', () => {
  test('should return type matching short name', () => {
    expect(ApiBuilderModel.isInstanceOf(subject.findModelByName('operation'))).toBe(true);
  });

  test('should return type matching fully qualified name', () => {
    expect(ApiBuilderModel.isInstanceOf(subject.findModelByName('com.bryzek.apidoc.spec.v0.models.operation'))).toBe(true);
  });
});

describe('ApiBuilderImport::findUnionByName', () => {
  test('should return type matching short name', () => {
    expect(ApiBuilderUnion.isInstanceOf(subject.findUnionByName('response_code'))).toBe(true);
  });

  test('should return type matching fully qualified name', () => {
    expect(ApiBuilderUnion.isInstanceOf(subject.findUnionByName('com.bryzek.apidoc.spec.v0.unions.response_code'))).toBe(true);
  });
});
