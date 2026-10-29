import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TransactionService } from '../../core/services/transaction';
import { Category, CategoryService } from '../../core/services/category';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, catchError, finalize, of, switchMap, tap } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';
import { TelegramConnectComponent } from '../../shared/components/telegram-connect/telegram-connect';
import { IconComponent } from '../../shared/components/icon/icon.component'; // Import para uso de icones

interface CategoryExpense {
  id: string;
  name: string;
  icon: string;
  total: number;
  percent: number;
  color: string;
}

interface DonutSegment extends CategoryExpense {
  dasharray: string;
  dashoffset: number;
}

interface TransactionGroup {
  date: string;
  label: string;
  items: any[];
  total: number;
}

interface BalanceDelta {
  value: number;
  direction: 'up' | 'down' | 'flat';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, TelegramConnectComponent, IconComponent],
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  private transactionService = inject(TransactionService);
  private categoryService = inject(CategoryService);
  private notify = inject(NotificationService);

  // Paleta estável para colorir cada categoria no gráfico/barras
  private readonly PALETTE = [
    '#f87171', '#fb923c', '#fbbf24', '#a3e635', '#34d399',
    '#22d3ee', '#38bdf8', '#818cf8', '#e879f9', '#f472b6',
  ];

  private refresh$ = new BehaviorSubject<void>(undefined);

  isLoading = signal(true);
  selectedMonth = signal(this.getCurrentMonth());
  categoryFilter = signal<string>('all');

  // Modal de confirmação de exclusão
  deleteTarget = signal<{ id: number; description: string } | null>(null);

  allTransactions = toSignal(
    this.refresh$.pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(() =>
        this.transactionService.getAll().pipe(
          catchError(() => {
            this.notify.error('Erro ao carregar transações.');
            return of([]);
          })
        )
      ),
      tap(() => this.isLoading.set(false)),
      finalize(() => this.isLoading.set(false))
    ),
    { initialValue: [] }
  );

  categories = toSignal(
    this.categoryService.getAll().pipe(catchError(() => of([] as Category[]))),
    { initialValue: [] as Category[] }
  );

  // ---- Mês atual / navegação ---------------------------------------------
  isCurrentMonth = computed(() => this.selectedMonth() === this.getCurrentMonth());

  monthTransactions = computed(() =>
    this.allTransactions().filter((t) => t.date.startsWith(this.selectedMonth()))
  );

  transactions = computed(() => {
    const filter = this.categoryFilter();
    const list = this.monthTransactions();
    if (filter === 'all') return list;
    if (filter === 'none') return list.filter((t) => !t.category);
    return list.filter((t) => String(t.category?.id) === filter);
  });

  summary = computed(() => {
    const list = this.monthTransactions();
    const income = list.filter((t) => t.type === 'INCOME').reduce((a, t) => a + t.amount, 0);
    const expense = list.filter((t) => t.type === 'EXPENSE').reduce((a, t) => a + t.amount, 0);
    return { income, expense, balance: income - expense };
  });

  // Comparação com o mês anterior (saldo)
  private previousMonthBalance = computed(() => {
    const prev = this.getPreviousMonthKey();
    const list = this.allTransactions().filter((t) => t.date.startsWith(prev));
    const income = list.filter((t) => t.type === 'INCOME').reduce((a, t) => a + t.amount, 0);
    const expense = list.filter((t) => t.type === 'EXPENSE').reduce((a, t) => a + t.amount, 0);
    return income - expense;
  });

  balanceDelta = computed<BalanceDelta | null>(() => {
    const prev = this.previousMonthBalance();
    const curr = this.summary().balance;
    if (prev === 0) return null; // sem base de comparação
    const change = ((curr - prev) / Math.abs(prev)) * 100;
    if (change === 0) return { value: 0, direction: 'flat' };
    return { value: Math.abs(change), direction: change > 0 ? 'up' : 'down' };
  });

  // ---- Despesas por categoria -------------------------------------------
  expensesByCategory = computed<CategoryExpense[]>(() => {
    const expenses = this.monthTransactions().filter((t) => t.type === 'EXPENSE');
    const total = expenses.reduce((a, t) => a + t.amount, 0);

    const groups = new Map<string, { id: string; name: string; icon: string; total: number }>();
    for (const t of expenses) {
      const key = t.category ? String(t.category.id) : 'none';
      const group = groups.get(key) ?? {
        id: key,
        name: t.category?.name ?? 'Sem categoria',
        icon: t.category?.icon ?? '❔',
        total: 0,
      };
      group.total += t.amount;
      groups.set(key, group);
    }

    return [...groups.values()]
      .sort((a, b) => b.total - a.total)
      .map((g, i) => ({
        ...g,
        percent: total > 0 ? (g.total / total) * 100 : 0,
        color: this.PALETTE[i % this.PALETTE.length],
      }));
  });

  // ---- Donut chart ------------------------------------------------------
  donutTotal = computed(() =>
    this.expensesByCategory().reduce((a, c) => a + c.total, 0)
  );

  donutSegments = computed<DonutSegment[]>(() => {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;
    return this.expensesByCategory().map((item) => {
      const length = (item.percent / 100) * circumference;
      const seg: DonutSegment = {
        ...item,
        dasharray: `${length} ${circumference}`,
        dashoffset: -offset,
      };
      offset += length;
      return seg;
    });
  });

  // ---- Agrupamento por dia ---------------------------------------------
  groupedTransactions = computed<TransactionGroup[]>(() => {
    const list = this.transactions();
    const groups = new Map<string, any[]>();
    for (const t of list) {
      const key = t.date.slice(0, 10);
      const arr = groups.get(key) ?? [];
      arr.push(t);
      groups.set(key, arr);
    }
    return [...groups.entries()]
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, items]) => ({
        date,
        label: this.formatDateLabel(date),
        items,
        total: items.reduce(
          (a, t) => a + (t.type === 'INCOME' ? t.amount : -t.amount),
          0
        ),
      }));
  });

  // ---- Helpers ----------------------------------------------------------
  private getCurrentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  private getPreviousMonthKey(): string {
    const [year, month] = this.selectedMonth().split('-').map(Number);
    const date = new Date(year, month - 2);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  private formatDateLabel(dateStr: string): string {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const sameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
    if (sameDay(date, today)) return 'Hoje';
    if (sameDay(date, yesterday)) return 'Ontem';
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  }

  asId(id: number | string): string {
    return String(id);
  }

  onCategoryFilter(value: string) {
    this.categoryFilter.set(value);
  }

  previousMonth() {
    const [year, month] = this.selectedMonth().split('-').map(Number);
    const date = new Date(year, month - 2);
    this.selectedMonth.set(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    );
  }

  nextMonth() {
  const [year, month] = this.selectedMonth().split('-').map(Number);
  const date = new Date(year, month);
  this.selectedMonth.set(
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  );
}

  goToCurrentMonth() {
    this.selectedMonth.set(this.getCurrentMonth());
  }

  formatMonthLabel(yearMonth: string): string {
    const [year, month] = yearMonth.split('-').map(Number);
    return new Date(year, month - 1).toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    });
  }

  // ---- Delete com modal -------------------------------------------------
  askDelete(t: { id: number; description: string }) {
    this.deleteTarget.set({ id: t.id, description: t.description });
  }

  cancelDelete() {
    this.deleteTarget.set(null);
  }

  confirmDelete() {
    const target = this.deleteTarget();
    if (!target) return;
    this.transactionService.delete(target.id).subscribe({
      next: () => {
        this.notify.success('Transação excluída com sucesso!');
        this.deleteTarget.set(null);
        this.refresh$.next();
      },
      error: () => this.notify.error('Erro ao excluir transação.'),
    });
  }
}