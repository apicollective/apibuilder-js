import { matchesProperty, overSome } from 'lodash';

export default function findTypeByName<T>(
  types: T[],
  name: string,
): T | undefined {
  return types.find(overSome([
    matchesProperty('shortName', name),
    matchesProperty('baseTypeName', name),
  ]));
}
