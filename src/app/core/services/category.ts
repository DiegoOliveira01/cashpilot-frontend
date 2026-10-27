import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  icon: string | null;
  builtIn: boolean; // true = padrão do sistema (não edita nem apaga)
}

export interface CategoryRequest {
  name: string;
  type: TransactionType;
  icon?: string;
}

export interface CategorySummary {
  categoryId: number | null; // null = "Sem categoria"
  name: string;
  icon: string | null;
  type: TransactionType;
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAll(type?: TransactionType): Observable<Category[]> {
    const params = type ? new HttpParams().set('type', type) : undefined;
    return this.http.get<Category[]>(this.apiUrl, { params });
  }

  create(data: CategoryRequest): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, data);
  }

  update(id: number, data: CategoryRequest): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
