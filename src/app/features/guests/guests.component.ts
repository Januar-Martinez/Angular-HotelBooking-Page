import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { GenericTableComponent } from '../../shared/components/generic-table/generic-table.component';
import { GenericModalComponent } from '../../shared/components/generic-modal/generic-modal.component';
import { GuestService } from '../../core/services/guest.service';
import { Guest } from '../../models/guest.model';
import { TableColumn } from '../../shared/models/table-column.model';
import { ModalConfig } from '../../shared/models/modal-field.model';
import { getApiError } from '../../core/utils/api-error.util';

@Component({
  selector: 'app-guests',
  standalone: true,
  imports: [GenericTableComponent, GenericModalComponent],
  templateUrl: './guests.component.html',
  styleUrl: './guests.component.scss',
})
export class GuestsComponent implements OnInit {
  private guestService = inject(GuestService);
  private cdr = inject(ChangeDetectorRef);
  apiError = '';

  @ViewChild('modal') modal!: GenericModalComponent;

  guests: Guest[] = [];
  selectedGuest: Guest | null = null;
  isLoading = false;
  errorMsg = '';

  columns: TableColumn[] = [
    { type: 'text', label: 'ID', accessor: 'id' },
    { type: 'text', label: 'Nombre', accessor: 'name' },
    { type: 'text', label: 'Email', accessor: 'email' },
    { type: 'text', label: 'Teléfono', accessor: 'phone' },
    {
      type: 'actions',
      label: 'Acciones',
      actions: [
        {
          icon: 'fa-solid fa-trash',
          tooltip: 'Eliminar',
          onClick: (row: Guest) => this.confirmDelete(row),
        },
      ],
    },
  ];

  modalConfig: ModalConfig = {
    modalId: 'guestModal',
    titleCreate: 'Registrar Huésped',
    titleEdit: 'Editar Huésped',
    fields: [
      {
        type: 'text',
        key: 'id',
        label: 'ID',
        icon: 'fa-solid fa-id-card',
        showOnCreate: false,
        showOnEdit: false,
      },
      {
        type: 'text',
        key: 'name',
        label: 'Nombre',
        icon: 'fa-solid fa-user',
        uppercase: true,
      },
      {
        type: 'text',
        key: 'email',
        label: 'Email',
        icon: 'fa-solid fa-envelope',
      },
      {
        type: 'text',
        key: 'phone',
        label: 'Teléfono',
        icon: 'fa-solid fa-phone',
      },
    ],
  };

  ngOnInit(): void {
    this.loadGuests();
  }

  loadGuests(): void {
    this.isLoading = true;
    this.errorMsg = '';

    this.guestService.getAll().subscribe({
      next: (data) => {
        this.guests = data;
        this.isLoading = false;

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMsg = 'Error al cargar los huéspedes.';
        this.isLoading = false;

        this.cdr.detectChanges();
        console.error(err);
      },
    });
  }

  openCreate(): void {
    this.selectedGuest = null;
    this.modal.open();
  }

  openEdit(guest: Guest): void {
    this.selectedGuest = guest;
    this.modal.open();
  }

  onModalClose(): void {
    this.selectedGuest = null;
    this.apiError = '';
  }

  onSave(formData: any): void {
    const { _isEdit, ...dto } = formData;

    this.guestService.create(dto).subscribe({
      next: () => {
        this.modal.closeModal();
        this.loadGuests();
      },
      error: (err) => {
        this.apiError = getApiError(err, 'Error al crear el huésped.');
      },
    });
  }

  confirmDelete(guest: Guest): void {
    const confirmed = confirm(`¿Eliminar a ${guest.name}?`);
    if (!confirmed) return;

    this.guestService.delete(guest.id).subscribe({
      next: () => this.loadGuests(),
      error: (err) => console.error(err),
    });
  }
}
