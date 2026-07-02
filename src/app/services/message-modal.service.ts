import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface MessageModalConfig {
  title?: string;
  message: string;
  type?: 'info' | 'confirm';
  confirmLabel?: string;
  cancelLabel?: string;
  redirectTo?: string | string[] | null;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
}

@Injectable({
  providedIn: 'root',
})
export class MessageModalService {
  readonly isOpen = signal(false);
  readonly title = signal('Information');
  readonly message = signal('');
  readonly type = signal<'info' | 'confirm'>('info');
  readonly confirmLabel = signal('OK');
  readonly cancelLabel = signal('Annuler');
  readonly redirectTo = signal<string | string[] | null>(null);

  private onConfirmHandler: (() => void | Promise<void>) | null = null;
  private onCancelHandler: (() => void | Promise<void>) | null = null;

  constructor(private router: Router) {}

  open(config: MessageModalConfig): void {
    this.title.set(config.title ?? (config.type === 'confirm' ? 'Confirmation' : 'Information'));
    this.message.set(config.message);
    this.type.set(config.type ?? 'info');
    this.confirmLabel.set(config.confirmLabel ?? (config.type === 'confirm' ? 'Confirmer' : 'OK'));
    this.cancelLabel.set(config.cancelLabel ?? 'Annuler');
    this.redirectTo.set(config.redirectTo ?? null);
    this.onConfirmHandler = config.onConfirm ?? null;
    this.onCancelHandler = config.onCancel ?? null;
    this.isOpen.set(true);
  }

  async confirm(): Promise<void> {
    if (this.onConfirmHandler) {
      await this.onConfirmHandler();
    }

    const target = this.redirectTo();
    this.close();

    if (target) {
      this.navigate(target);
    }
  }

  async cancel(): Promise<void> {
    if (this.onCancelHandler) {
      await this.onCancelHandler();
    }

    this.close();
  }

  close(): void {
    this.isOpen.set(false);
    this.onConfirmHandler = null;
    this.onCancelHandler = null;
    this.redirectTo.set(null);
  }

  private navigate(target: string | string[]): void {
    const commands = Array.isArray(target) ? target : [target];
    this.router.navigate(commands);
  }
}
