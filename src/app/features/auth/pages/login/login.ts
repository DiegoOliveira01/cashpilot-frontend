import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
  private authService: AuthService,
  private router: Router,
  private cdr: ChangeDetectorRef
  ) {}

  onLogin() {
    
    if (!this.email || !this.password) {
      this.errorMessage = 'Preencha email e senha.';
      this.cdr.detectChanges();
      return;
    }

    this.errorMessage = '';
    this.isLoading = true; // Ativa o loading no button

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        // Salva token
        localStorage.setItem('token', response.token);

        this.isLoading = false; // Desativa o efeito de loading se sucesso

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false; // Desativa o efeito de loading no erro
        if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'Email ou senha inválidos.';
        } else {
          this.errorMessage = 'Erro ao realizar login. Tente novamente.';
        }
        this.cdr.detectChanges(); // resolve o NG0100
      }
    });
  }
}