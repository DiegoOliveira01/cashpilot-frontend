import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  errorMessage = '';
  sucessMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onRegister() {
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Preencha todos os campos.';
      this.cdr.detectChanges();
      return;
    }

    this.errorMessage = '';
    this.isLoading = true; // Ativa o loading no button

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.isLoading = false; // Desativa o efeito de loading se sucesso

        this.sucessMessage = 'Sucesso ao criar conta';

        this.cdr.detectChanges();
        
        // aguarda 2 segundos para o usuário ler a mensagem
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false; // Desativa o efeito de loading no erro

        if (err.status === 409 || err.status === 500) {
          this.errorMessage = 'Email já cadastrado.';
        } else {
          this.errorMessage = 'Erro ao cadastrar. Tente novamente.';
        }
        this.cdr.detectChanges();
      }
    });
  }
}