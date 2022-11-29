import { astFromTypeName, typeNameFromAst } from '../../src';

const baseType = 'com.bryzek.apidoc.common.v0.models.reference';

describe('typeNameFromAst', () => {
  test('string', () => {
    const ast = astFromTypeName('string');
    expect(typeNameFromAst(ast)).toBe('string');
  });

  test('map[string]', () => {
    const ast = astFromTypeName('map[string]');
    expect(typeNameFromAst(ast)).toBe('map[string]');
  });

  test('map[[string]]', () => {
    const ast = astFromTypeName('map[[string]]');
    expect(typeNameFromAst(ast)).toBe('map[[string]]');
  });

  test(`map[map[map[[${baseType}]]]`, () => {
    const ast = astFromTypeName(`map[map[map[[${baseType}]]]]`);
    expect(typeNameFromAst(ast)).toBe(`map[map[map[[${baseType}]]]]`);
  });

  test('[[[[string]]]]', () => {
    const ast = astFromTypeName('[[[[string]]]]');
    expect(typeNameFromAst(ast)).toBe('[[[[string]]]]');
  });
});
