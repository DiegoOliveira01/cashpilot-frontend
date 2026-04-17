import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard')
        .then(m => m.DashboardComponent)
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' }
];