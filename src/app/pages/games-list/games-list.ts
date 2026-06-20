import { Component } from '@angular/core';
import { TableInfo } from '../../models/tableModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-games-list',
  imports: [],
  templateUrl: './games-list.html',
  styleUrl: './games-list.css',
})
export class GamesList {
   tables: TableInfo[] = [
    { id: 1, num_players: 2, host_name: 'Alice' },
    { id: 2, num_players: 4, host_name: 'Bob' },
    { id: 3, num_players: 1, host_name: 'Charlie' }
  ];

  constructor(private router: Router) {}

  joinTable(table: TableInfo) {
    this.router.navigate(['/table', table.id]);
  }
}
