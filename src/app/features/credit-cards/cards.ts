import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CreditCardService } from '../../core/services/credit-card.service';
import { CreditCardRequest, CreditCardResponse } from '../../core/services/credit-card';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-credit-cards',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent],
  templateUrl: './cards.html'
})
export class CreditCardsComponent implements OnInit {
  private service = inject(CreditCardService);
  private notify = inject(NotificationService);

  cards = signal<CreditCardResponse[]>([]);
  isLoading = signal(true);

  // Controle do Modal
  isModalOpen = signal(false);
  isSaving = signal(false);

  // Lista de imagens pré-definidas (imagens estão na pasta assets/cards)
  availableImages = [
    { url: '/cards/card_nu.png', label: 'Nubank' },
    { url: '/cards/card_itau.png', label: 'Itaú' },
    { url: '/cards/card_bradesco.png', label: 'Bradesco' },
    { url: '/cards/card_america.png', label: 'América' },
    { url: '/cards/card_elo.png', label: 'Elo' },
    { url: '/cards/card_hipercard.png', label: 'Hipercard' },
    { url: '/cards/card_master.png', label: 'Mastercard' },
    { url: '/cards/card_mp.png', label: 'Mercado Pago' },
    { url: '/cards/card_visa.png', label: 'Visa' },
  ];

  form: CreditCardRequest = {
    name: '',
    brand: 'Visa',
    closingDay: 25,
    dueDay: 5,
    limitAmount: 0,
    imageUrl: '/cards/card_nu.png' // Imagem padrão
  };

  ngOnInit() {
    this.loadCards();
  }

  loadCards() {
    this.isLoading.set(true);
    this.service.getAll().subscribe({
      next: (data) => {
        this.cards.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.notify.error('Erro ao carregar cartões.');
        this.isLoading.set(false);
      }
    });
  }

  openModal() {
    this.form = {
      name: '',
      brand: 'Visa',
      closingDay: 25,
      dueDay: 5,
      limitAmount: 0,
      imageUrl: this.availableImages[0].url
    };
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  saveCard() {
    if (!this.form.name || this.form.limitAmount <= 0) {
      this.notify.error('Preencha o nome e um limite válido.');
      return;
    }

    this.isSaving.set(true);
    this.service.create(this.form).subscribe({
      next: () => {
        this.notify.success('Cartão criado com sucesso!');
        this.closeModal();
        this.loadCards();
        this.isSaving.set(false);
      },
      error: () => {
        this.notify.error('Erro ao criar cartão.');
        this.isSaving.set(false);
      }
    });
  }
}