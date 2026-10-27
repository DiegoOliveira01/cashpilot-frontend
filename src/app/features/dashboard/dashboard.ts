import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TransactionService } from '../../core/services/transaction';
import { Category, CategoryService } from '../../core/services/category';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, catchError, finalize, of, switchMap, tap } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';
import { TelegramConnectComponent } from '../../shared/components/telegram-connect/telegram-connect';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, TelegramConnectComponent],
  templateUrl: './dashboard.html'
})
export class DashboardComponent {

  private transactionService = inject(TransactionService);
  private categoryService = inject(CategoryService);
  private notify = inject(NotificationService);

  private refresh$ = new BehaviorSubject<void>(undefined);

  isLoading = signal(true); // começa true — já está carregando ao abrir

  selectedMonth = signal(this.getCurrentMonth()); // mês atual no formato "2026-04"

  // filtro da lista: 'all' | 'none' (sem categoria) | id da categoria
  categoryFilter = signal<string>('all');

  allTransactions = toSignal(
    this.refresh$.pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(() => this.transactionService.getAll()),
      tap(() => this.isLoading.set(false)),
      finalize(() => this.isLoading.set(false))
    ),
    { initialValue: [] }
  );

  categories = toSignal(
    this.categoryService.getAll().pipe(catchError(() => of([] as Category[]))),
    { initialValue: [] as Category[] }
  );

  // transações do mês selecionado (base do resumo e do gráfico por categoria)
  monthTransactions = computed(() =>
    this.allTransactions().filter(t =>
      t.date.startsWith(this.selectedMonth())
    )
  );

  // lista exibida: mês + filtro de categoria
  transactions = computed(() => {
    const filter = this.categoryFilter();
    const list = this.monthTransactions();

    if (filter === 'all') return list;
    if (filter === 'none') return list.filter(t => !t.category);
    return list.filter(t => String(t.category?.id) === filter);
  });

  // o resumo olha o mês inteiro, independente do filtro de categoria
  summary = computed(() => {
    const list = this.monthTransactions();
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

  // despesas do mês agrupadas por categoria, com a participação de cada uma
  expensesByCategory = computed(() => {
    const expenses = this.monthTransactions().filter(t => t.type === 'EXPENSE');
    const total = expenses.reduce((acc, t) => acc + t.amount, 0);

    const groups = new Map<string, { name: string; icon: string; total: number }>();
    for (const t of expenses) {
      const key = t.category ? String(t.category.id) : 'none';
      const group = groups.get(key) ?? {
        name: t.category?.name ?? 'Sem categoria',
        icon: t.category?.icon ?? '❔',
        total: 0
      };
      group.total += t.amount;
      groups.set(key, group);
    }

    return [...groups.values()]
      .sort((a, b) => b.total - a.total)
      .map(g => ({ ...g, percent: total > 0 ? (g.total / total) * 100 : 0 }));
  });

  private getCurrentMonth(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${now.getFullYear()}-${month}`;
  }

  onCategoryFilter(value: string) {
    this.categoryFilter.set(value);
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
