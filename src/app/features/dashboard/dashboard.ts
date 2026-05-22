import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TransactionService } from '../../core/services/transaction';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, finalize, switchMap, tap } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './dashboard.html'
})
export class DashboardComponent {

  private transactionService = inject(TransactionService);
  private notify = inject(NotificationService);

  private refresh$ = new BehaviorSubject<void>(undefined);

  isLoading = signal(true); // começa true — já está carregando ao abrir

  selectedMonth = signal(this.getCurrentMonth()); // mês atual no formato "2026-04"

  /*
  transactions = toSignal(
    this.refresh$.pipe(
      tap(() => this.isLoading.set(true)),         // ativa ao iniciar
      switchMap(() => this.transactionService.getAll()),
      tap(() => this.isLoading.set(false)),         // desativa ao terminar
      finalize(() => this.isLoading.set(false))     // garante desativar em caso de erro
    ),
    { initialValue: [] }
  );
  */

  allTransactions = toSignal(
    this.refresh$.pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(() => this.transactionService.getAll()),
      tap(() => this.isLoading.set(false)),
      finalize(() => this.isLoading.set(false))
    ),
    { initialValue: [] }
  );

  // filtra as transações pelo mês selecionado
  transactions = computed(() =>
    this.allTransactions().filter(t =>
      t.date.startsWith(this.selectedMonth())
    )
  );

  // recalcula o summary localmente com base nas transações filtradas
  summary = computed(() => {
    const list = this.transactions();
    const income = list
      .filter(t => t.type === 'INCOME')
      .reduce((acc, t) => acc + t.amount, 0);
    const expense = list
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc, t) => acc + t.amount, 0);
    return {
      income,
      expense,
      balance: income - expense
    };
  });

  private getCurrentMonth(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${now.getFullYear()}-${month}`;
  }

  // navega entre os meses
  previousMonth() {
    const [year, month] = this.selectedMonth().split('-').map(Number);
    const date = new Date(year, month - 2);
    const m = String(date.getMonth() + 1).padStart(2, '0');
    this.selectedMonth.set(`${date.getFullYear()}-${m}`);
  }

  nextMonth() {
    const [year, month] = this.selectedMonth().split('-').map(Number);
    const date = new Date(year, month);
    const m = String(date.getMonth() + 1).padStart(2, '0');
    this.selectedMonth.set(`${date.getFullYear()}-${m}`);
  }

  // formata "2026-04" para "Abril 2026"
  formatMonthLabel(yearMonth: string): string {
    const [year, month] = yearMonth.split('-').map(Number);
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }

  /*
  summary = toSignal(
    this.refresh$.pipe(switchMap(() => this.transactionService.getSummary()))
  );
  */

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

}