import { snakeCase, toUpper } from 'lodash';
import { EnumValue } from '../../generated/types/apibuilder-spec';

/**
 * An object representing an API builder enum value definition.
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-enum_value
 */
export class ApiBuilderEnumValue {
  private config: EnumValue;

  constructor(config: EnumValue) {
    this.config = config;
  }

  /**
   * This property holds the name of the enum value.
   */
  get name() {
    return this.config.name;
  }

  /**
   * A string used to identify this enumeration value. Useful for naming the
   * variable corresponding to this enumeration value in code generators.
   */
  get nickname() {
    return toUpper(snakeCase(this.name));
  }

  /**
   * This property holds an optional description for what
   * this enum value provides.
   */
  get description() {
    return this.config.description;
  }

  /**
   * This property holds additional meta data about enum value.
   */
  get attributes() {
    return this.config.attributes;
  }

  /**
   * This property holds whether this enum value is deprecated.
   */
  get isDeprecated() {
    return this.config.deprecation != null;
  }

  /**
   * This property holds an optional message indicating the reason this
   * enum value is deprecated.
   */
  get deprecationReason() {
    if (this.config.deprecation) {
      return this.config.deprecation.description;
    }
  }

  public toString() {
    return this.name;
  }
}
