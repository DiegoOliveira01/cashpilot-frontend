import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreditCardRequest, CreditCardResponse } from './credit-card';

@Injectable({ providedIn: 'root' })
export class CreditCardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/credit-cards`;

  getAll(): Observable<CreditCardResponse[]> {
    return this.http.get<CreditCardResponse[]>(this.apiUrl);
  }

  create(data: CreditCardRequest): Observable<CreditCardResponse> {
    return this.http.post<CreditCardResponse>(this.apiUrl, data);
  }
}