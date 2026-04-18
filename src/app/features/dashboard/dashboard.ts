import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `<h1>Dashboard (logado)</h1> <button (click)="logout()">Sair</button>`
})
export class DashboardComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(){
    this.authService.logout();

    // REDIRECT
    this.router.navigate(['/login']);
  }
}