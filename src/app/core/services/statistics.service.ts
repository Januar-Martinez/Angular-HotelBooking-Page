import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Statistics } from '../../models/statistics.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/reservations/statistics`;

  get(): Observable<Statistics> {
    return this.http.get<Statistics>(this.url);
  }
}