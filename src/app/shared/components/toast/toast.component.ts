import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (notification.notification()) {
      <div [class]="getClass()">
        {{ notification.notification()!.text }}
      </div>
    }
  `,
  styles: [`
    div {
      position: fixed;
      bottom: 24px;
      right: 24px;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: white;
      z-index: 9999;
      animation: fadeIn 0.3s ease;
    }
    .success { background-color: #16a34a; }
    .error   { background-color: #dc2626; }
    .warning { background-color: #d97706; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ToastComponent {
  notification = inject(NotificationService);

  getClass(): string {
    return this.notification.notification()?.type ?? 'success';
  }
}