import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Category, CategoryService, TransactionType } from '../../core/services/category';
import { NotificationService } from '../../core/services/notification.service';
import { IconComponent } from '../../shared/components/icon/icon.component'; // Import para uso de icones
import { AVAILABLE_ICONS } from '../../shared/constants/icons'; // Import de array de icones

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [FormsModule, RouterLink, IconComponent], 
  templateUrl: './categories.html'
})
export class CategoriesComponent implements OnInit {

  private service = inject(CategoryService);
  private notify = inject(NotificationService);

  categories = signal<Category[]>([]);
  expenseCategories = computed(() => this.categories().filter(c => c.type === 'EXPENSE'));
  incomeCategories = computed(() => this.categories().filter(c => c.type === 'INCOME'));

  editingId = signal<number | null>(null);
  isSaving = signal(false);

  // Controle do seletor de ícones
  isIconPickerOpen = signal(false);

  // Apenas referenciando a constante externa
  availableIcons = AVAILABLE_ICONS;

  form: { name: string; type: TransactionType; icon: string } = {
    name: '',
    type: 'EXPENSE',
    icon: ''
  };

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getAll().subscribe({
      next: (list) => this.categories.set(list),
      error: () => this.notify.error('Erro ao carregar categorias.')
    });
  }

  save() {
    const name = this.form.name.trim();
    if (!name) return;

    const payload = {
      name,
      type: this.form.type,
      icon: this.form.icon.trim() || undefined
    };

    const id = this.editingId();
    const request$ = id === null
      ? this.service.create(payload)
      : this.service.update(id, payload);

    this.isSaving.set(true);
    request$.pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: () => {
        this.notify.success(id === null ? 'Categoria criada!' : 'Categoria atualizada!');
        this.resetForm();
        this.load();
      },
      error: (err) => {
        this.notify.error(err?.status === 409
          ? 'Já existe uma categoria com esse nome.'
          : 'Erro ao salvar categoria.');
      }
    });
  }

  edit(category: Category) {
    this.editingId.set(category.id);
    this.form = { 
      name: category.name, 
      type: category.type, 
      icon: category.icon ?? '' 
    };
    this.isIconPickerOpen.set(false); // Fecha o seletor ao editar
  }

  cancelEdit() {
    this.resetForm();
  }

  remove(category: Category) {
    const confirmed = confirm(
      `Excluir "${category.name}"? As transações dessa categoria vão ficar sem categoria.`
    );
    if (!confirmed) return;

    this.service.delete(category.id).subscribe({
      next: () => {
        this.notify.success('Categoria excluída.');
        if (this.editingId() === category.id) this.resetForm();
        this.load();
      },
      error: () => this.notify.error('Erro ao excluir categoria.')
    });
  }

  setType(type: TransactionType) {
    if (this.editingId() === null) this.form.type = type;
  }

  toggleIconPicker() {
    this.isIconPickerOpen.update(v => !v);
  }

  selectIcon(iconName: string) {
    this.form.icon = iconName;
    this.isIconPickerOpen.set(false); // Fecha após escolher
  }

  private resetForm() {
    this.editingId.set(null);
    this.form = { name: '', type: 'EXPENSE', icon: '' };
    this.isIconPickerOpen.set(false);
  }
}