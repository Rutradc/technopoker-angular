import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TableService } from './services/TableService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('technopoker');
  username = computed(() => this.tableService.username$());

  constructor(private tableService: TableService) {}
}
