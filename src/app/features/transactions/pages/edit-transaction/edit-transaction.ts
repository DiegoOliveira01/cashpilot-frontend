import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../../../core/services/transaction';

@Component({
  selector: 'app-edit-transaction',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-transaction.html',
})
export class EditTransactionComponent implements OnInit{

  private service = inject(TransactionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router)
  private fb = inject(FormBuilder);

  id!: number;

  form = this.fb.group({
    description: ['', Validators.required],
    amount: [0, [Validators.required]],
    type: ['INCOME', Validators.required],
    date: ['', Validators.required]
  });

  ngOnInit() {
  this.id = Number(this.route.snapshot.paramMap.get('id'));

  this.service.getById(this.id).subscribe({
    next: (data) => {
      this.form.patchValue({
          description: data.description,
          amount: data.amount,
          type: data.type,
          date: data.date
        });
      }
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.service.update(this.id, this.form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => console.error(err)
  });
  }
}
