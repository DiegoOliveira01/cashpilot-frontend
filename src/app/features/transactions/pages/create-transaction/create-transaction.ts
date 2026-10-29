import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TransactionService } from '../../../../core/services/transaction';
import { Category, CategoryService, TransactionType } from '../../../../core/services/category';
import { RecurringTransactionService } from '../../../../core/services/recurring-transaction.service';
import { RecurrenceFrequency } from '../../../../core/services/recurring-transaction';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-create-transaction',
  standalone: true,
  imports: [FormsModule, RouterLink, IconComponent],
  templateUrl: './create-transaction.html'
})
export class CreateTransactionComponent implements OnInit {

  private service = inject(TransactionService);
  private categoryService = inject(CategoryService);
  private recurringService = inject(RecurringTransactionService);
  private router = inject(Router);

  categories = signal<Category[]>([]);

  form: {
    description: string;
    amount: number;
    type: TransactionType;
    date: string;
    categoryId: number | null;
    // Campos de Recorrência
    isRecurring: boolean;
    frequency: RecurrenceFrequency;
    firstDayOfMonth: number | null;
    secondDayOfMonth: number | null;
    endDate: string | null;
    maxOccurrences: number | null;
  } = {
    description: '',
    amount: 0,
    type: 'EXPENSE',
    date: new Date().toISOString().split('T')[0], // Preenche com a data de hoje por padrão
    categoryId: null,
    isRecurring: false,
    frequency: 'MONTHLY',
    firstDayOfMonth: null,
    secondDayOfMonth: null,
    endDate: null,
    maxOccurrences: null
  };

  // Só as categorias do tipo selecionado (receita ou despesa)
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

    toggleRecurrence() {
    this.form.isRecurring = !this.form.isRecurring;

    if (this.form.isRecurring && !this.form.date) {
      // Se ligou a recorrência e não tem data, sugere hoje
      this.form.date = new Date().toISOString().split('T')[0];
    }

    if (this.form.isRecurring && this.form.date) {
      // Preenche o dia do mês baseado na data escolhida
      this.updateFirstDay();
    }
  }

  updateFirstDay() {
    if (this.form.isRecurring && this.form.date) {
      this.form.firstDayOfMonth = new Date(this.form.date + 'T00:00:00').getDate();
    }
  }

  submit() {
    if (this.form.isRecurring) {
      // Monta o payload para recorrência
      const payloadRecurring = {
        description: this.form.description,
        amount: this.form.amount,
        type: this.form.type,
        categoryId: this.form.categoryId,
        frequency: this.form.frequency,
        firstDayOfMonth: this.form.firstDayOfMonth,
        secondDayOfMonth: this.form.frequency === 'TWICE_MONTHLY' ? this.form.secondDayOfMonth : null,
        startDate: this.form.date,
        endDate: this.form.endDate,
        maxOccurrences: this.form.maxOccurrences
      };

      this.recurringService.create(payloadRecurring).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Erro ao criar recorrência', err);
        }
      });
    } else {
      // Monta o payload de transação normal (remove os campos extras que o backend não espera)
      const payloadNormal = {
        description: this.form.description,
        amount: this.form.amount,
        type: this.form.type,
        date: this.form.date,
        categoryId: this.form.categoryId
      };

      this.service.create(payloadNormal).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }
}