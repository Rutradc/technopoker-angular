import { Component, signal } from '@angular/core';
import { Table } from '../../models/tableModel';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from '../../services/TableService';

@Component({
  selector: 'app-game-waiting-room',
  imports: [],
  templateUrl: './game-waiting-room.html',
  styleUrl: './game-waiting-room.css',
})
export class GameWaitingRoom {
  tableId!: number;

  table$ = signal<Table | null>(null);
  username: string = localStorage.getItem('username') || '';

  constructor(private route: ActivatedRoute, private router: Router, private tableService: TableService) {}

  async ngOnInit(): Promise<void> {
    if (localStorage.getItem('username') === null) {
      this.router.navigate(['']);
    }
    if (!this.tableService.connected()) {
      this.tableService.connect();
      await this.tableService.joinTable(Number(this.route.snapshot.paramMap.get('id')));
      if (!this.tableService.currentTable$()) {
        this.router.navigate(['/tables']);
        alert('La table est introuvable ou pleine.');
      } // TODO: gérer le cas où la table n'existe pas ou est pleine
    }

    if (!this.tableService.currentTable$()) {
      this.tableService.joinTable(Number(this.route.snapshot.paramMap.get('id')));
    }
    // this.tableId = Number(this.route.snapshot.paramMap.get('id'));

    this.table$ = this.tableService.currentTable$;
    // ⚠️ simulation (plus tard → API backend)
    // this.table = {
    //   id: this.tableId,
    //   num_players: 3,
    //   host_name: 'Alice'
    // };
  }

  startGame() {
    console.log('Démarrage de la partie pour la table', this.table$()?.table_id);
    this.router.navigate(['/game', this.table$()?.table_id]);
  }
}
