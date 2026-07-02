import { Component, computed } from '@angular/core';
import { MessageModalService } from '../../services/message-modal.service';

@Component({
  selector: 'app-message-modal',
  imports: [],
  templateUrl: './message-modal.html',
  styleUrl: './message-modal.css',
})
export class MessageModal {
  isOpen = computed(() => this.modalService.isOpen());
  title = computed(() => this.modalService.title());
  message = computed(() => this.modalService.message());
  type = computed(() => this.modalService.type());
  confirmLabel = computed(() => this.modalService.confirmLabel());
  cancelLabel = computed(() => this.modalService.cancelLabel());

  constructor(private modalService: MessageModalService) {}

  async confirm(): Promise<void> {
    await this.modalService.confirm();
  }

  async cancel(): Promise<void> {
    await this.modalService.cancel();
  }

  async backdropClick(): Promise<void> {
    if (this.type() === 'confirm') {
      await this.cancel();
      return;
    }

    await this.confirm();
  }
}
