import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  email = '';
  password = '';
  errormessage = '';

  constructor(private authService: AuthService) {}

  onLogin() {
    this.errormessage = '';

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        console.log('Login sucesso', response);

        // Salva token
        localStorage.setItem('token', response.token);
      },
      error: (err) => {
        console.error(err);
        this.errormessage = 'Email ou senha inválidos';
      }
    });
  }
}