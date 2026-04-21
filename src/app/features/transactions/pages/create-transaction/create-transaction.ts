import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from '../../../../core/services/transaction';

@Component({
  selector: 'app-create-transaction',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-transaction.html'
  //styleUrl: './create-transaction.css',
})
export class CreateTransactionComponent {
  
  private service = inject(TransactionService);
  private router = inject(Router);

  form = {
    description: '',
    amount: 0,
    type: 'INCOME',
    date: ''
  };

  submit(){
    this.service.create(this.form).subscribe({
      next: () => {
        // volta para o dasboar após criar
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
