import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login';
import { authGuard } from './core/guards/auth-guard';
import { noAuthGuard } from './core/guards/no-auth-guard';

export const routes: Routes = [
  { path: 'login', 
    component: LoginComponent,
    canActivate: [noAuthGuard] 
  },

  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard')
        .then(m => m.DashboardComponent)
  },

  {
    path: 'transactions/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/transactions/pages/create-transaction/create-transaction')
    .then(m => m.CreateTransactionComponent)
  },

  {
    path: 'transactions/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/transactions/pages/edit-transaction/edit-transaction')
    .then(m => m.EditTransactionComponent)

  },

  { path: '', redirectTo: 'login', pathMatch: 'full' }
];