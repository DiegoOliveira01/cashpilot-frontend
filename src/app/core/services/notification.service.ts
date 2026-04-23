import { Injectable, signal } from '@angular/core';

export interface Notification {
  text: string;
  type: 'success' | 'error' | 'warning';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {

  notification = signal<Notification | null>(null);

  success(text: string) {
    this.show(text, 'success');
  }

  error(text: string) {
    this.show(text, 'error');
  }

  warning(text: string) {
    this.show(text, 'warning');
  }

  private show(text: string, type: 'success' | 'error' | 'warning') {
    this.notification.set({ text, type });
    setTimeout(() => this.notification.set(null), 3000);
  }
}