import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RecurringTransactionRequest, RecurringTransactionResponse } from './recurring-transaction';

@Injectable({ providedIn: 'root' })
export class RecurringTransactionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/recurring-transactions`;

  getAll(): Observable<RecurringTransactionResponse[]> {
    return this.http.get<RecurringTransactionResponse[]>(this.apiUrl);
  }

  create(data: RecurringTransactionRequest): Observable<RecurringTransactionResponse> {
    return this.http.post<RecurringTransactionResponse>(this.apiUrl, data);
  }

  toggleActive(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/toggle`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}