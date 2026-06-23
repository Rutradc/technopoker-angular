import { Component, computed, signal } from '@angular/core';
import { Table } from '../../models/tableModel';
import { Router } from '@angular/router';
import { TableService } from '../../services/TableService';

@Component({
  selector: 'app-games-list',
  imports: [],
  templateUrl: './games-list.html',
  styleUrl: './games-list.css',
})
export class GamesList {
  tables$ = signal<Table[]>([]);
  username = computed(() => this.tableService.username$());

  constructor(private router: Router, public tableService: TableService) {
    this.tables$ = this.tableService.tableList$;
  }

  ngOnInit(): void {
    if (this.username() === null) {
      this.router.navigate(['']);
    }
    if (!this.tableService.connected()) {
      this.tableService.connect();
    }

    this.tableService.listTables();
  }

  joinTable(table: Table) {
    this.router.navigate(['/table', table.table_id]);
  }

  goToMenu() {
    this.router.navigate(['']);
  }
}
