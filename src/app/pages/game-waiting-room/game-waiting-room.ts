import { Component, computed, signal } from '@angular/core';
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
  username = computed(() => this.tableService.username$());

  constructor(private route: ActivatedRoute, private router: Router, private tableService: TableService) {
    this.table$ = this.tableService.currentTable$;
  }

  async ngOnInit(): Promise<void> {
    if (this.username() === null) {
      this.router.navigate(['']);
    }
    if (!this.tableService.connected()) {
      this.tableService.connect();
      await this.tableService.joinTable(Number(this.route.snapshot.paramMap.get('id')));
      if (!this.tableService.currentTable$()) {
        this.router.navigate(['/tables']);
        alert('La table est introuvable ou pleine ou votre pseudo est déjà utilisé dans cette table.');
      } // TODO: gérer le cas où la table n'existe pas ou est pleine
    }

    if (!this.tableService.currentTable$()) {
      this.tableService.joinTable(Number(this.route.snapshot.paramMap.get('id')));
    }
    // this.tableId = Number(this.route.snapshot.paramMap.get('id'));
  }

  startGame() {
    console.log('Démarrage de la partie pour la table', this.table$()?.table_id);
    this.tableService.startGame(this.table$()?.table_id!);
  }

  async leaveTable() {
    if (confirm("Quitter la table ?")){
      console.log('Quitter la table', this.table$()?.table_id);
      await this.tableService.leaveTable(this.table$()?.table_id!);
      this.router.navigate(['']);
    }
  }
}
