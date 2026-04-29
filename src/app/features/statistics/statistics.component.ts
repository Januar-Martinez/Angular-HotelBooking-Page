import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericTableComponent } from '../../shared/components/generic-table/generic-table.component';
import { StatisticsService } from '../../core/services/statistics.service';
import { Statistics, RoomOccupancy } from '../../models/statistics.model';
import { TableColumn } from '../../shared/models/table-column.model';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, GenericTableComponent],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent implements OnInit {
  private statisticsService = inject(StatisticsService);
  private cdr = inject(ChangeDetectorRef);

  stats: Statistics | null = null;
  occupancyRows: RoomOccupancy[] = [];
  isLoading = false;
  errorMsg = '';

  columns: TableColumn[] = [
    { type: 'text', label: 'Habitación',   accessor: 'room_number' },
    { type: 'text', label: 'Reservaciones', accessor: 'total_reservations' },
    { type: 'text', label: 'Noches',        accessor: 'total_nights' },
    { type: 'text', label: 'Ingresos',      accessor: 'total_revenue' },
  ];

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.isLoading = true;
    this.errorMsg = '';

    this.statisticsService.get().subscribe({
      next: (data) => {
        this.stats = data;
        this.occupancyRows = data.occupancy_by_room;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMsg = 'Error al cargar las estadísticas.';
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error(err);
      },
    });
  }
}