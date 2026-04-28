import {
  Component, Input, Output, EventEmitter,
  OnChanges, SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalConfig, ModalField, SelectField, TextField } from '../../models/modal-field.model';

@Component({
  selector: 'app-generic-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generic-modal.component.html',
  styleUrl:    './generic-modal.component.scss'
})
export class GenericModalComponent implements OnChanges {

  @Input({ required: true }) config!: ModalConfig;

  @Input() editData: any | null = null;

  @Output() save  = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  isEditMode = false;
  formData: Record<string, any> = {};
  isOpen = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editData']) {
      this.isEditMode = this.editData !== null;
      this.buildForm();
    }
  }

  open(): void {
    this.buildForm();
    this.isOpen = true;
  }

  closeModal(): void {
    this.isOpen = false;
    this.close.emit();
  }

  private buildForm(): void {
    this.formData = {};
    for (const field of this.config.fields) {
      if (this.isEditMode && this.editData) {
        this.formData[field.key] = this.editData[field.key] ?? '';
      } else {
        this.formData[field.key] = field.type === 'number' ? 0 : '';
      }
    }
  }

  isFieldVisible(field: ModalField): boolean {
    if (field.type === 'hidden') return false;
    if (this.isEditMode)  return field.showOnEdit   !== false;
    return                       field.showOnCreate !== false;
  }

  asSelect(field: ModalField): SelectField {
    return field as SelectField;
  }

  asText(field: ModalField): TextField {
    return field as TextField;
  }

  onSave(): void {
    if (!this.validate()) return;
    this.save.emit({ ...this.formData, _isEdit: this.isEditMode });
  }

  errors: Record<string, string> = {};

  private validate(): boolean {
    this.errors = {};
    for (const field of this.config.fields) {
      if (!this.isFieldVisible(field)) continue;
      if (field.required === false)    continue;

      const val = this.formData[field.key];
      const isEmpty = val === '' || val === null || val === undefined;
      const isZero  = field.type === 'number' && Number(val) === 0;

      if (isEmpty || isZero) {
        this.errors[field.key] = `${field.label} es requerido`;
      }
    }
    return Object.keys(this.errors).length === 0;
  }

  onTextInput(field: ModalField, event: Event): void {
    const textField = this.asText(field);
    if (textField.uppercase) {
      const input = event.target as HTMLInputElement;
      this.formData[field.key] = input.value.toUpperCase();
    }
  }
}