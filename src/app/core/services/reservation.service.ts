import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, map } from 'rxjs';
import { Reservation, CreateReservationDto } from '../../models/reservation.model';
import { Guest } from '../../models/guest.model';
import { Room } from '../../models/rooms.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/reservations/`;
  private guestsUrl = `${environment.apiUrl}/guests/`;
  private roomsUrl = `${environment.apiUrl}/rooms/`;

  getAll(): Observable<Reservation[]> {
    return forkJoin({
      reservations: this.http.get<Reservation[]>(this.url),
      guests: this.http.get<Guest[]>(this.guestsUrl),
      rooms: this.http.get<Room[]>(this.roomsUrl),
    }).pipe(
      map(({ reservations, guests, rooms }) => {
        return reservations.map((r) => ({
          ...r,
          guest_name:
            guests.find((g) => String(g.id) === String(r.guest_id))?.name ?? `ID ${r.guest_id}`,
          room_number:
            rooms.find((ro) => String(ro.id) === String(r.room_id))?.number ?? `ID ${r.room_id}`,
        }));
      }),
    );
  }

  create(dto: CreateReservationDto): Observable<Reservation> {
    return this.http.post<Reservation>(this.url, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}${id}`);
  }
}
