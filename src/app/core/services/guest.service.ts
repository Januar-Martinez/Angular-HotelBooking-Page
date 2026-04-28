import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Guest, CreateGuestDto, UpdateGuestDto } from '../../models/guest.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  private http = inject(HttpClient);
  private url  = `${environment.apiUrl}/guests/`;

  getAll(): Observable<Guest[]> {
    return this.http.get<Guest[]>(this.url);
  }

  getById(id: string): Observable<Guest> {
    return this.http.get<Guest>(`${this.url}${id}`);
  }

  create(dto: CreateGuestDto): Observable<Guest> {
    return this.http.post<Guest>(this.url, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}${id}`);
  }
}