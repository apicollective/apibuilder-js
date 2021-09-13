import type { ApiBuilderFileFlag } from './types';

/**
 * Class representing a generated source file.
 * @see https://app.apibuilder.io/bryzek/apidoc-generator/latest#model-file
 */
export default class ApiBuilderFile {
  public name: string;

  public dir: string;

  public contents: string;

  public flags: ApiBuilderFileFlag | undefined;

  /**
   * Create a source file.
   * @param basename The recommended name for the file, including the file extension.
   * @param dirname The recommended directory path for the file where appropriate.
   * @param contents The actual source code.
   */
  constructor(
    basename: string,
    dirname: string,
    contents: string,
    flags?: ApiBuilderFileFlag,
  ) {
    this.name = basename;
    this.dir = dirname;
    this.contents = contents;
    this.flags = flags;
  }
}
