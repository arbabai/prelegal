export interface FieldDef {
  key: string;
  label: string;
  inputType?: "date" | "text";
  multiline?: boolean;
  default?: string;
}

export interface ClientDocConfig {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  fields: FieldDef[];
}

/** Record of fieldKey → current value */
export type DocFields = Record<string, string>;

export interface GenericChatApiResponse {
  message: string;
  fields: Record<string, string | null>;
}
