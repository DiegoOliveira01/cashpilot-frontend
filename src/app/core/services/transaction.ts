import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, retry } from 'rxjs';

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
}

export interface TransactionSummary {
  income: number;
  expense: number;
  balance: number;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {

  private apiUrl = 'http://localhost:8080/transactions'

  constructor(private http: HttpClient) {}

  getAll(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  getById(id: number){
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  getSummary(): Observable<TransactionSummary> {
    return this.http.get<TransactionSummary>(`${this.apiUrl}/summary`);
  }

  create(data: any): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, data);
  }

  update(id: number, data: any) {
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
  return this.http.delete(`${this.apiUrl}/${id}`);
}
}
