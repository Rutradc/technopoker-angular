import { Component, signal } from '@angular/core';
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

  constructor(private router: Router, public tableService: TableService) {}

  ngOnInit(): void {
    if (localStorage.getItem('username') === null) {
      this.router.navigate(['']);
    }
    if (!this.tableService.connected()) {
      this.tableService.connect();
    }

    this.tableService.listTables();
    this.tables$ = this.tableService.tableList$;
  }

  joinTable(table: Table) {
    this.router.navigate(['/table', table.table_id]);
  }
}
