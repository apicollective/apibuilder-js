declare namespace io.apibuilder.common.v0.models {
  interface Audit {
    readonly 'created_at': string;
    readonly 'created_by': io.apibuilder.common.v0.models.ReferenceGuid;
    readonly 'updated_at': string;
    readonly 'updated_by': io.apibuilder.common.v0.models.ReferenceGuid;
  }

  interface Healthcheck {
    readonly 'status': string;
  }

  interface Reference {
    readonly 'guid': string;
    readonly 'key': string;
  }

  interface ReferenceGuid {
    readonly 'guid': string;
  }
}

declare namespace io.apibuilder.spec.v0.enums {
  type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'CONNECT' | 'OPTIONS' | 'TRACE';
  type ParameterLocation = 'Path' | 'Query' | 'Form' | 'Header';
  type ResponseCodeOption = 'Default';
}

declare namespace io.apibuilder.spec.v0.models {
  interface Annotation {
    readonly 'name': string;
    readonly 'description'?: string;
    readonly 'deprecation'?: io.apibuilder.spec.v0.models.Deprecation;
  }

  interface Apidoc {
    readonly 'version': string;
  }

  interface Application {
    readonly 'key': string;
  }

  interface Attribute {
    readonly 'name': string;
    readonly 'value': {
      [key: string]: string;
    };
    readonly 'description'?: string;
    readonly 'deprecation'?: io.apibuilder.spec.v0.models.Deprecation;
  }

  interface Body {
    readonly 'type': string;
    readonly 'description'?: string;
    readonly 'deprecation'?: io.apibuilder.spec.v0.models.Deprecation;
    readonly 'attributes': io.apibuilder.spec.v0.models.Attribute[];
  }

  interface Contact {
    readonly 'name'?: string;
    readonly 'url'?: string;
    readonly 'email'?: string;
  }

  interface Deprecation {
    readonly 'description'?: string;
  }

  interface Enum {
    readonly 'name': string;
    readonly 'plural': string;
    readonly 'description'?: string;
    readonly 'deprecation'?: io.apibuilder.spec.v0.models.Deprecation;
    readonly 'values': io.apibuilder.spec.v0.models.EnumValue[];
    readonly 'attributes': io.apibuilder.spec.v0.models.Attribute[];
  }

  interface EnumValue {
    readonly 'name': string;
    readonly 'description'?: string;
    readonly 'deprecation'?: io.apibuilder.spec.v0.models.Deprecation;
    readonly 'attributes': io.apibuilder.spec.v0.models.Attribute[];
    readonly 'value'?: string;
  }

  interface Field {
    readonly 'name': string;
    readonly 'type': string;
    readonly 'description'?: string;
    readonly 'deprecation'?: io.apibuilder.spec.v0.models.Deprecation;
    readonly 'default'?: string;
    readonly 'required': boolean;
    readonly 'minimum'?: number;
    readonly 'maximum'?: number;
    readonly 'example'?: string;
    readonly 'attributes': io.apibuilder.spec.v0.models.Attribute[];
    readonly 'annotations'?: string[];
  }

  interface Header {
    readonly 'name': string;
    readonly 'type': string;
    readonly 'description'?: string;
    readonly 'deprecation'?: io.apibuilder.spec.v0.models.Deprecation;
    readonly 'required': boolean;
    readonly 'default'?: string;
    readonly 'attributes': io.apibuilder.spec.v0.models.Attribute[];
  }

  interface Import {
    readonly 'uri': string;
    readonly 'namespace': string;
    readonly 'organization': io.apibuilder.spec.v0.models.Organization;
    readonly 'application': io.apibuilder.spec.v0.models.Application;
    readonly 'version': string;
    readonly 'enums': string[];
    readonly 'unions': string[];
    readonly 'models': string[];
    readonly 'annotations'?: io.apibuilder.spec.v0.models.Annotation[];
  }

  interface Info {
    readonly 'license'?: io.apibuilder.spec.v0.models.License;
    readonly 'contact'?: io.apibuilder.spec.v0.models.Contact;
  }

  interface License {
    readonly 'name': string;
    readonly 'url'?: string;
  }

  interface Model {
    readonly 'name': string;
    readonly 'plural': string;
    readonly 'description'?: string;
    readonly 'deprecation'?: io.apibuilder.spec.v0.models.Deprecation;
    readonly 'fields': io.apibuilder.spec.v0.models.Field[];
    readonly 'attributes': io.apibuilder.spec.v0.models.Attribute[];
  }

  interface Operation {
    readonly 'method': io.apibuilder.spec.v0.enums.Method;
    readonly 'path': string;
    readonly 'description'?: string;
    readonly 'deprecation'?: io.apibuilder.spec.v0.models.Deprecation;
    readonly 'body'?: io.apibuilder.spec.v0.models.Body;
    readonly 'parameters': io.apibuilder.spec.v0.models.Parameter[];
    readonly 'responses': io.apibuilder.spec.v0.models.Response[];
    readonly 'attributes': io.apibuilder.spec.v0.models.Attribute[];
  }

  interface Organization {
    readonly 'key': string;
  }

  interface Parameter {
    readonly 'name': string;
    readonly 'type': string;
    readonly 'location': io.apibuilder.spec.v0.enums.ParameterLocation;
    readonly 'description'?: string;
    readonly 'deprecation'?: io.apibuilder.spec.v0.models.Deprecation;
    readonly 'required': boolean;
    readonly 'default'?: string;
    readonly 'minimum'?: number;
    readonly 'maximum'?: number;
    readonly 'example'?: string;
    readonly 'attributes'?: io.apibuilder.spec.v0.models.Attribute[];
  }

  interface Resource {
    readonly 'type': string;
    readonly 'plural': string;
    readonly 'path'?: string;
    readonly 'description'?: string;
    readonly 'deprecation'?: io.apibuilder.spec.v0.models.Deprecation;
    readonly 'operations': io.apibuilder.spec.v0.models.Operation[];
    readonly 'attributes': io.apibuilder.spec.v0.models.Attribute[];
  }

  interface Response {
    readonly 'code': io.apibuilder.spec.v0.unions.ResponseCode;
    readonly 'type': string;
    readonly 'headers'?: io.apibuilder.spec.v0.models.Header[];
    readonly 'description'?: string;
    readonly 'deprecation'?: io.apibuilder.spec.v0.models.Deprecation;
    readonly 'attributes'?: io.apibuilder.spec.v0.models.Attribute[];
  }

  interface Service {
    readonly 'apidoc': io.apibuilder.spec.v0.models.Apidoc;
    readonly 'name': string;
    readonly 'organization': io.apibuilder.spec.v0.models.Organization;
    readonly 'application': io.apibuilder.spec.v0.models.Application;
    readonly 'namespace': string;
    readonly 'version': string;
    readonly 'base_url'?: string;
    readonly 'description'?: string;
    readonly 'info': io.apibuilder.spec.v0.models.Info;
    readonly 'headers': io.apibuilder.spec.v0.models.Header[];
    readonly 'imports': io.apibuilder.spec.v0.models.Import[];
    readonly 'enums': io.apibuilder.spec.v0.models.Enum[];
    readonly 'unions': io.apibuilder.spec.v0.models.Union[];
    readonly 'models': io.apibuilder.spec.v0.models.Model[];
    readonly 'resources': io.apibuilder.spec.v0.models.Resource[];
    readonly 'attributes': io.apibuilder.spec.v0.models.Attribute[];
    readonly 'annotations'?: io.apibuilder.spec.v0.models.Annotation[];
  }

  interface Union {
    readonly 'name': string;
    readonly 'plural': string;
    readonly 'discriminator'?: string;
    readonly 'description'?: string;
    readonly 'deprecation'?: io.apibuilder.spec.v0.models.Deprecation;
    readonly 'types': io.apibuilder.spec.v0.models.UnionType[];
    readonly 'attributes': io.apibuilder.spec.v0.models.Attribute[];
  }

  interface UnionType {
    readonly 'type': string;
    readonly 'description'?: string;
    readonly 'deprecation'?: io.apibuilder.spec.v0.models.Deprecation;
    readonly 'attributes': io.apibuilder.spec.v0.models.Attribute[];
    readonly 'default'?: boolean;
    readonly 'discriminator_value'?: string;
  }
}

declare namespace io.apibuilder.spec.v0.unions {
  type ResponseCode = ({
    discriminator: 'integer';
    value: number;
  } | {
    discriminator: 'response_code_option';
    value: io.apibuilder.spec.v0.enums.ResponseCodeOption;
  });
}

declare namespace io.apibuilder.generator.v0.enums {
  type FileFlag = 'scaffolding';
}

declare namespace io.apibuilder.generator.v0.models {
  interface Attribute {
    readonly 'name': string;
    readonly 'value': string;
  }

  interface Error {
    readonly 'code': string;
    readonly 'message': string;
  }

  interface File {
    readonly 'name': string;
    readonly 'dir'?: string;
    readonly 'contents': string;
    readonly 'flags'?: io.apibuilder.generator.v0.enums.FileFlag[];
  }

  interface Generator {
    readonly 'key': string;
    readonly 'name': string;
    readonly 'language'?: string;
    readonly 'description'?: string;
    readonly 'attributes': string[];
  }

  interface Healthcheck {
    readonly 'status': string;
  }

  interface Invocation {
    readonly 'source': string;
    readonly 'files': io.apibuilder.generator.v0.models.File[];
  }

  interface InvocationForm {
    readonly 'service': io.apibuilder.spec.v0.models.Service;
    readonly 'attributes': io.apibuilder.generator.v0.models.Attribute[];
    readonly 'user_agent'?: string;
    readonly 'imported_services'?: io.apibuilder.spec.v0.models.Service[];
  }
}

export type Attribute = io.apibuilder.generator.v0.models.Attribute;
export type Error = io.apibuilder.generator.v0.models.Error;
export type File = io.apibuilder.generator.v0.models.File;
export type FileFlag = io.apibuilder.generator.v0.enums.FileFlag;
export type Generator = io.apibuilder.generator.v0.models.Generator;
export type Healthcheck = io.apibuilder.generator.v0.models.Healthcheck;
export type Invocation = io.apibuilder.generator.v0.models.Invocation;
export type InvocationForm = io.apibuilder.generator.v0.models.InvocationForm;
