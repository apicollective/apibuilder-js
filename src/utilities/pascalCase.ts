import { camelCase, upperFirst } from 'lodash';

export default function pascalCase(
  string: string,
): string {
  return upperFirst(camelCase(string));
}
