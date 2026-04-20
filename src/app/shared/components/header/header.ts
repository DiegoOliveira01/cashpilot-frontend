import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html'
})
export class HeaderComponent {

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}


