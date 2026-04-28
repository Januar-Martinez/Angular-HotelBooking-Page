import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { GenericTableComponent } from '../../shared/components/generic-table/generic-table.component';
import { GenericModalComponent } from '../../shared/components/generic-modal/generic-modal.component';
import { RoomService } from '../../core/services/room.service';
import { Room } from '../../models/rooms.models';
import { TableColumn } from '../../shared/models/table-column.model';
import { ModalConfig } from '../../shared/models/modal-field.model';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [GenericTableComponent, GenericModalComponent],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss',
})
export class RoomsComponent implements OnInit {
  private roomService = inject(RoomService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('modal') modal!: GenericModalComponent;

  rooms: Room[] = [];
  selectedRoom: Room | null = null;
  isLoading = false;
  errorMsg = '';

  columns: TableColumn[] = [
    { type: 'text', label: 'ID', accessor: 'id' },
    { type: 'text', label: 'Numero', accessor: 'number' },
    { type: 'text', label: 'Tipo', accessor: 'type' },
    { type: 'monetary', label: 'Precio', accessor: 'price' },
    { type: 'boolean', label: 'Habilitada', accessor: 'is_available' },
    {
      type: 'actions',
      label: 'Acciones',
      actions: [
        {
          icon: 'fa-solid fa-trash',
          tooltip: 'Eliminar',
          onClick: (row: Room) => this.confirmDelete(row),
        },
      ],
    },
  ];

  modalConfig: ModalConfig = {
    modalId: 'guestModal',
    titleCreate: 'Registrar Habitación',
    titleEdit: 'Editar Habitación',
    fields: [
      {
        type: 'text',
        key: 'id',
        label: 'ID',
        icon: 'fa-solid fa-hashtag',
        showOnCreate: false,
        showOnEdit: false,
      },
      {
        type: 'text',
        key: 'number',
        label: 'Numero',
        icon: 'fa-solid fa-door-open',
      },
      {
        type: 'select',
        key: 'type',
        label: 'Tipo',
        icon: 'fa-solid fa-bed',
        options: [
          { label: 'simple', value: 'simple' },
          { label: 'doble', value: 'doble' },
          { label: 'suite', value: 'suite' },
        ],
      },
      {
        type: 'number',
        key: 'price',
        label: 'Precio',
        icon: 'fa-solid fa-dollar-sign',
      },
      {
        type: 'select',
        key: 'is_available',
        label: 'Disponibilidad',
        icon: 'fa-solid fa-toggle-on',
        options: [
          { label: 'Disponible', value: true },
          { label: 'Ocupada', value: false },
        ],
      },
    ],
  };

  ngOnInit(): void {
      this.loadGuests();
    }
  
    loadGuests(): void {
    this.isLoading = true;
    this.errorMsg = '';
  
    this.roomService.getAll().subscribe({
      next: (data) => {
        this.rooms = data;
        this.isLoading = false;
  
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMsg = 'Error al cargar las habitaciones.';
        this.isLoading = false;
  
        this.cdr.detectChanges();
        console.error(err);
      },
    });
  }
  
    openCreate(): void {
      this.selectedRoom = null;
      this.modal.open();
    }
  
    openEdit(room: Room): void {
      this.selectedRoom = room;
      this.modal.open();
    }
  
    onSave(formData: any): void {
      const { _isEdit, ...dto } = formData;
  
      this.roomService.create(dto).subscribe({
        next: () => {
          this.modal.closeModal();
          this.loadGuests();
        },
        error: (err) => console.error(err),
      });
    }
  
    confirmDelete(room: Room): void {
      const confirmed = confirm(`¿Eliminar la habitación ${room.number}?`);
      if (!confirmed) return;
  
      this.roomService.delete(room.id).subscribe({
        next: () => this.loadGuests(),
        error: (err) => console.error(err),
      });
    }
}
