import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room, CreateRoomDto  } from '../../models/rooms.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private http = inject(HttpClient);
  private url  = `${environment.apiUrl}/rooms/`;

  getAll(): Observable<Room[]> {
    return this.http.get<Room[]>(this.url);
  }

  getById(id: string): Observable<Room> {
    return this.http.get<Room>(`${this.url}${id}`);
  }

  create(dto: CreateRoomDto): Observable<Room> {
    return this.http.post<Room>(this.url, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}${id}`);
  }
}