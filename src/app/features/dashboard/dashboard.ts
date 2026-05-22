import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TransactionService } from '../../core/services/transaction';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, finalize, switchMap, tap } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent {

  private transactionService = inject(TransactionService);
  private notify = inject(NotificationService);

  private refresh$ = new BehaviorSubject<void>(undefined);

  isLoading = signal(true); // começa true — já está carregando ao abrir

  transactions = toSignal(
    this.refresh$.pipe(
      tap(() => this.isLoading.set(true)),         // ativa ao iniciar
      switchMap(() => this.transactionService.getAll()),
      tap(() => this.isLoading.set(false)),         // desativa ao terminar
      finalize(() => this.isLoading.set(false))     // garante desativar em caso de erro
    ),
    { initialValue: [] }
  );

  summary = toSignal(
    this.refresh$.pipe(switchMap(() => this.transactionService.getSummary()))
  );

  delete(id: number) {
  const confirmed = confirm('Deseja excluir esta transação?');

  if (!confirmed) return;

  this.transactionService.delete(id).subscribe({
    next: () => {
        this.notify.success('Transação excluída com sucesso!'); // 3. feedback
        this.refresh$.next();
      },
      error: () => this.notify.error('Erro ao excluir transação.')
    });
}

reloadData() {
  this.transactions = toSignal(this.transactionService.getAll(), { initialValue: [] });
  this.summary = toSignal(this.transactionService.getSummary());
}

}