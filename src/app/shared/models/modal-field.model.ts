export type FieldType = 'text' | 'number' | 'select' | 'hidden';

export interface SelectOption {
  label: string;
  value: any;
}

interface BaseField {
  type:        FieldType;
  key:         string;
  label:       string;
  icon?:       string;
  required?:   boolean;
  showOnCreate?: boolean;
  showOnEdit?:   boolean;
}

export interface TextField extends BaseField {
  type: 'text';
  uppercase?: boolean;
}

export interface NumberField extends BaseField {
  type: 'number';
  min?: number;
  max?: number;
}

export interface SelectField extends BaseField {
  type: 'select';
  options: SelectOption[];
}

export interface HiddenField extends BaseField {
  type: 'hidden';
}

export type ModalField =
  | TextField
  | NumberField
  | SelectField
  | HiddenField;

export interface ModalConfig {
  modalId:    string;
  titleCreate: string; 
  titleEdit:   string;
  fields:      ModalField[];
}