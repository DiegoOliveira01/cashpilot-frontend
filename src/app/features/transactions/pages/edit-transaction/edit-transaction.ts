import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TransactionService } from '../../../../core/services/transaction';
import { Category, CategoryService, TransactionType } from '../../../../core/services/category';

@Component({
  selector: 'app-edit-transaction',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-transaction.html',
})
export class EditTransactionComponent implements OnInit{

  private service = inject(TransactionService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router)
  private fb = inject(FormBuilder);

  id!: number;

  categories = signal<Category[]>([]);

  form = this.fb.group({
    description: ['', Validators.required],
    amount: [0, [Validators.required]],
    type: ['INCOME', Validators.required],
    date: ['', Validators.required],
    categoryId: [null as number | null]
  });

  // só as categorias do tipo selecionado (receita ou despesa)
  get availableCategories(): Category[] {
    const type = this.form.get('type')?.value;
    return this.categories().filter(c => c.type === type);
  }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.categoryService.getAll().subscribe({
      next: (list) => this.categories.set(list),
      error: (err) => console.error(err)
    });

    this.service.getById(this.id).subscribe({
      next: (data) => {
        this.form.patchValue({
          description: data.description,
          amount: data.amount,
          type: data.type,
          date: data.date,
          categoryId: data.category?.id ?? null
        });
      }
    });
  }

  setType(type: TransactionType) {
    this.form.patchValue({ type, categoryId: null }); // a categoria pode não existir no outro tipo
  }

  submit() {
    if (this.form.invalid) return;

    this.service.update(this.id, this.form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => console.error(err)
    });
  }
}
