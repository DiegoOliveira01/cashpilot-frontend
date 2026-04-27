import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../src/environments/environment';
import { Observable } from 'rxjs';

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<any>{
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    //return this.http.post<LoginResponse>(this.apiUrl, data);
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, data)
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLogged(): boolean {
    return !!localStorage.getItem('token');
  }
}