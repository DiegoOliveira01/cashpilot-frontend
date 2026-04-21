import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TransactionService } from '../../core/services/transaction';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent {

  private transactionService = inject(TransactionService);

  transactions = toSignal(this.transactionService.getAll(), { initialValue: [] });
  summary = toSignal(this.transactionService.getSummary());

  delete(id: number) {
  const confirmed = confirm('Deseja excluir esta transação?');

  if (!confirmed) return;

  this.transactionService.delete(id).subscribe({
    next: () => this.reloadData(),
    error: (err) => console.error(err)
  });
}

reloadData() {
  this.transactions = toSignal(this.transactionService.getAll(), { initialValue: [] });
  this.summary = toSignal(this.transactionService.getSummary());
}

}