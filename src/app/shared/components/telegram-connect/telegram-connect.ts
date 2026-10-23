import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Subscription, catchError, filter, finalize, of, switchMap, take, timer } from 'rxjs';
import * as QRCode from 'qrcode';
import { TelegramService, TelegramLinkCode, TelegramStatus } from '../../../core/services/telegram';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-telegram-connect',
  standalone: true,
  templateUrl: './telegram-connect.html'
})
export class TelegramConnectComponent implements OnInit, OnDestroy {

  private telegramService = inject(TelegramService);
  private notify = inject(NotificationService);

  status = signal<TelegramStatus | null>(null);
  isConnected = computed(() => this.status()?.connected === true);

  isLoading = signal(false);
  linkCode = signal<TelegramLinkCode | null>(null);
  qrDataUrl = signal<string | null>(null);
  showConnected = signal(false);

  private polling?: Subscription;

  ngOnInit() {
    this.telegramService.getStatus().subscribe({
      next: (s) => this.status.set(s),
      // sem status, o botão simplesmente continua como "Conectar Telegram"
      error: () => this.status.set(null)
    });
  }

  ngOnDestroy() {
    this.stopPolling();
  }

  onButtonClick() {
    if (this.isConnected()) {
      this.showConnected.set(true);
    } else {
      this.connect();
    }
  }

  connect() {
    this.isLoading.set(true);

    this.telegramService.generateLinkCode()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.linkCode.set(res);
          this.generateQr(res.deepLink);
          if (!this.isConnected()) {
            this.waitForConnection();
          }
        },
        error: () => this.notify.error('Erro ao gerar o link do Telegram.')
      });
  }

  close() {
    this.stopPolling();
    this.linkCode.set(null);
    this.qrDataUrl.set(null);
    this.showConnected.set(false);
  }

  // O QR é gerado no próprio navegador: o código de uso único não é enviado a nenhum serviço externo.
  private generateQr(deepLink: string) {
    QRCode.toDataURL(deepLink, { width: 352, margin: 1, errorCorrectionLevel: 'M' })
      .then((url) => this.qrDataUrl.set(url))
      // se falhar, o modal segue só com o botão "Abrir no Telegram"
      .catch(() => this.qrDataUrl.set(null));
  }

  // Depois do link gerado, consulta o status a cada 3s (por ~10 min, a validade do código)
  // e vira o botão para "conectado" assim que o usuário tocar em Iniciar no Telegram.
  private waitForConnection() {
    this.stopPolling();

    this.polling = timer(3000, 3000).pipe(
      take(200),
      switchMap(() => this.telegramService.getStatus().pipe(catchError(() => of(null)))),
      filter((s): s is TelegramStatus => s?.connected === true),
      take(1)
    ).subscribe((s) => {
      this.status.set(s);
      this.close();
      this.notify.success('Telegram conectado com sucesso!');
    });
  }

  private stopPolling() {
    this.polling?.unsubscribe();
    this.polling = undefined;
  }
}
