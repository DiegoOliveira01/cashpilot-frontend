import { Component, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { TelegramService, TelegramLinkCode } from '../../../core/services/telegram';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-telegram-connect',
  standalone: true,
  templateUrl: './telegram-connect.html'
})
export class TelegramConnectComponent {

  private telegramService = inject(TelegramService);
  private notify = inject(NotificationService);

  isLoading = signal(false);
  linkCode = signal<TelegramLinkCode | null>(null);

  connect() {
    this.isLoading.set(true);

    this.telegramService.generateLinkCode()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => this.linkCode.set(res),
        error: () => this.notify.error('Erro ao gerar o link do Telegram.')
      });
  }

  close() {
    this.linkCode.set(null);
  }
}
