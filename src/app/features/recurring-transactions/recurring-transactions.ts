import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RecurringTransactionService } from '../../core/services/recurring-transaction.service';
import { RecurringTransactionResponse } from '../../core/services/recurring-transaction';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-recurring-transactions',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './recurring-transactions.html'
})
export class RecurringTransactionsComponent implements OnInit {
  private service = inject(RecurringTransactionService);
  private notify = inject(NotificationService);

  recurrences = signal<RecurringTransactionResponse[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoading.set(true);
    this.service.getAll().subscribe({
      next: (data) => {
        this.recurrences.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.notify.error('Erro ao carregar recorrências.');
        this.isLoading.set(false);
      }
    });
  }

  toggle(id: number) {
    this.service.toggleActive(id).subscribe({
      next: () => {
        this.notify.success('Status alterado.');
        this.load();
      }
    });
  }

  delete(id: number) {
    if (!confirm('Excluir esta recorrência? O histórico de transações já geradas NÃO será apagado.')) return;

    this.service.delete(id).subscribe({
      next: () => {
        this.notify.success('Recorrência excluída.');
        this.load();
      }
    });
  }

  getFrequencyLabel(freq: string): string {
    if (freq === 'WEEKLY') return 'Semanal';
    if (freq === 'MONTHLY') return 'Mensal';
    return '2x no mês';
  }
}