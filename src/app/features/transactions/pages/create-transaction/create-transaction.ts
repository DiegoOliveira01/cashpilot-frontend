import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TransactionService } from '../../../../core/services/transaction';
import { Category, CategoryService, TransactionType } from '../../../../core/services/category';
import { IconComponent } from '../../../../shared/components/icon/icon.component'; // Import para uso de icones

@Component({
  selector: 'app-create-transaction',
  standalone: true,
  imports: [FormsModule, RouterLink, IconComponent],
  templateUrl: './create-transaction.html'
  //styleUrl: './create-transaction.css',
})
export class CreateTransactionComponent implements OnInit {

  private service = inject(TransactionService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  categories = signal<Category[]>([]);

  form: {
    description: string;
    amount: number;
    type: TransactionType;
    date: string;
    categoryId: number | null;
  } = {
    description: '',
    amount: 0,
    type: 'INCOME',
    date: '',
    categoryId: null
  };

  // só as categorias do tipo selecionado (receita ou despesa)
  get availableCategories(): Category[] {
    return this.categories().filter(c => c.type === this.form.type);
  }

  ngOnInit() {
    this.categoryService.getAll().subscribe({
      next: (list) => this.categories.set(list),
      error: (err) => console.error(err)
    });
  }

  setType(type: TransactionType) {
    this.form.type = type;
    this.form.categoryId = null; // a categoria escolhida pode não existir no outro tipo
  }

  submit(){
    this.service.create(this.form).subscribe({
      next: () => {
        // volta para o dashboard após criar
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
