import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RecurringTransactionService } from '../../core/services/recurring-transaction.service';
import { RecurringTransactionResponse, RecurrenceFrequency } from '../../core/services/recurring-transaction';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { NotificationService } from '../../core/services/notification.service';
import { Category, CategoryService } from '../../core/services/category'; 

@Component({
  selector: 'app-recurring-transactions',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, FormsModule],
  templateUrl: './recurring-transactions.html'
})
export class RecurringTransactionsComponent implements OnInit {
  private service = inject(RecurringTransactionService);
  private categoryService = inject(CategoryService); // Injetando categorias
  private notify = inject(NotificationService);

  recurrences = signal<RecurringTransactionResponse[]>([]);
  categories = signal<Category[]>([]); // Para o select de categoria
  isLoading = signal(true);

  isEditModalOpen = signal(false);
  editingId = signal<number | null>(null);
  isSaving = signal(false);

  // Objeto do formulário de edição
  form: any = {
    description: '',
    amount: 0,
    type: 'EXPENSE',
    categoryId: null,
    frequency: 'MONTHLY',
    firstDayOfMonth: null,
    secondDayOfMonth: null,
    endDate: null,
    maxOccurrences: null,
    startDate: '' // Necessario, mas não vamos alterar no update
  };

  // Categorias filtradas pelo tipo selecionado
  availableCategories = computed(() => {
    return this.categories().filter(c => c.type === this.form.type);
  });

  ngOnInit() {
    this.load();
    this.categoryService.getAll().subscribe(list => this.categories.set(list));
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

  // ---- Lógica de Edição ----
  openEditModal(rec: RecurringTransactionResponse) {
    this.editingId.set(rec.id);
    this.form = {
      description: rec.description,
      amount: rec.amount,
      type: rec.type,
      categoryId: rec.categoryId,
      frequency: rec.frequency,
      firstDayOfMonth: rec.firstDayOfMonth,   
      secondDayOfMonth: rec.secondDayOfMonth,
      endDate: null, // Se adicionar no DTO no futuro, coloque aqui
      maxOccurrences: null,
      startDate: rec.startDate
    };
    this.isEditModalOpen.set(true);
  }

  closeEditModal() {
    this.isEditModalOpen.set(false);
    this.editingId.set(null);
  }

  saveEdit() {
    const id = this.editingId();
    if (!id) return;

    const payload = {
      description: this.form.description,
      amount: this.form.amount,
      type: this.form.type,
      categoryId: this.form.categoryId,
      frequency: this.form.frequency,
      firstDayOfMonth: this.form.firstDayOfMonth,
      secondDayOfMonth: this.form.frequency === 'TWICE_MONTHLY' ? this.form.secondDayOfMonth : null,
      startDate: this.form.startDate, // Envia, mas o backend ignora para não bagunçar o histórico
      endDate: this.form.endDate,
      maxOccurrences: this.form.maxOccurrences
    };

    this.isSaving.set(true);
    this.service.update(id, payload).subscribe({
      next: () => {
        this.notify.success('Recorrência atualizada com sucesso!');
        this.closeEditModal();
        this.load();
        this.isSaving.set(false);
      },
      error: () => {
        this.notify.error('Erro ao atualizar recorrência.');
        this.isSaving.set(false);
      }
    });
  }
}