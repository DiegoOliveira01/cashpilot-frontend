import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TransactionService } from '../../core/services/transaction';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent {

  private transactionService = inject(TransactionService);

  transactions = toSignal(this.transactionService.getAll(), { initialValue: [] });
  summary = toSignal(this.transactionService.getSummary());

}