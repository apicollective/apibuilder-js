import { snakeCase, toUpper } from 'lodash';

export default function constantCase(
  string: string,
): string {
  return toUpper(snakeCase(string));
}
