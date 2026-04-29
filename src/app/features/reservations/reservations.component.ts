import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { GenericTableComponent } from '../../shared/components/generic-table/generic-table.component';
import { GenericModalComponent } from '../../shared/components/generic-modal/generic-modal.component';
import { ReservationService } from '../../core/services/reservation.service';
import { Reservation } from '../../models/reservation.model';
import { TableColumn } from '../../shared/models/table-column.model';
import { ModalConfig } from '../../shared/models/modal-field.model';
import { getApiError } from '../../core/utils/api-error.util';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [GenericTableComponent, GenericModalComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss',
})
export class ReservationsComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private cdr = inject(ChangeDetectorRef);
  apiError = '';

  @ViewChild('modal') modal!: GenericModalComponent;

  reservations: Reservation[] = [];
  selectedReservation: Reservation | null = null;
  isLoading = false;
  errorMsg = '';

  columns: TableColumn[] = [
    { type: 'text', label: 'ID', accessor: 'id' },
    { type: 'text', label: 'Huésped', accessor: 'guest_name' },
    { type: 'text', label: 'Habitación', accessor: 'room_number' },
    { type: 'text', label: 'Check-in', accessor: 'check_in' },
    { type: 'text', label: 'Check-out', accessor: 'check_out' },
    { type: 'monetary', label: 'Total', accessor: 'total_price' },
    {
      type: 'actions',
      label: 'Acciones',
      actions: [
        {
          icon: 'fa-solid fa-trash',
          tooltip: 'Eliminar',
          onClick: (row: Reservation) => this.confirmDelete(row),
        },
      ],
    },
  ];

  modalConfig: ModalConfig = {
    modalId: 'reservationModal',
    titleCreate: 'Nueva Reservación',
    titleEdit: 'Editar Reservación',
    fields: [
      { type: 'text', key: 'guest_id', label: 'ID Huésped', icon: 'fa-solid fa-user' },
      { type: 'text', key: 'room_id', label: 'ID Habitación', icon: 'fa-solid fa-door-open' },
      { type: 'date', key: 'check_in', label: 'Check-in', icon: 'fa-solid fa-calendar-check' },
      { type: 'date', key: 'check_out', label: 'Check-out', icon: 'fa-solid fa-calendar-xmark' },
    ],
  };

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.isLoading = true;
    this.errorMsg = '';

    this.reservationService.getAll().subscribe({
      next: (data) => {
        this.reservations = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMsg = 'Error al cargar las reservaciones.';
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error(err);
      },
    });
  }

  openCreate(): void {
    this.selectedReservation = null;
    this.modal.open();
  }

  onModalClose(): void {
    this.selectedReservation = null;
    this.apiError = '';
  }

  onSave(formData: any): void {
    const { _isEdit, guest_name, room_number, ...dto } = formData;

    this.reservationService.create(dto).subscribe({
      next: () => {
        this.modal.closeModal();
        this.loadReservations();
      },
      error: (err) => {
        this.apiError = getApiError(err, 'Error al crear el huésped.');
      },
    });
  }

  confirmDelete(reservation: Reservation): void {
    const label = reservation.guest_name ?? `reservación ${reservation.id}`;
    const confirmed = confirm(`¿Eliminar la reservación de ${label}?`);
    if (!confirmed) return;

    this.reservationService.delete(reservation.id).subscribe({
      next: () => this.loadReservations(),
      error: (err) => console.error(err),
    });
  }
}
