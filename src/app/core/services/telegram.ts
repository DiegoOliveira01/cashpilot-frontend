import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TelegramLinkCode {
  code: string;
  deepLink: string;
  expiresInMinutes: number;
}

export interface TelegramStatus {
  connected: boolean;
  botUsername: string;
}

@Injectable({
  providedIn: 'root',
})
export class TelegramService {

  private apiUrl = `${environment.apiUrl}/telegram`;

  constructor(private http: HttpClient) {}

  generateLinkCode(): Observable<TelegramLinkCode> {
    return this.http.post<TelegramLinkCode>(`${this.apiUrl}/link-code`, {});
  }

  getStatus(): Observable<TelegramStatus> {
    return this.http.get<TelegramStatus>(`${this.apiUrl}/status`);
  }
}
