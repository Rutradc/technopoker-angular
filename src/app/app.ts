import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TableService } from './services/TableService';
import { MessageModal } from './components/message-modal/message-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MessageModal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('technopoker');
  username = computed(() => this.tableService.username$());
  connected = computed(() => this.tableService.connected());

  constructor(private tableService: TableService) {}
}
