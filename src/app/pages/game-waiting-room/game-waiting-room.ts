import { Component, computed, signal } from '@angular/core';
import { Table } from '../../models/tableModel';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from '../../services/TableService';
import { MessageModalService } from '../../services/message-modal.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tableService: TableService,
    private modalService: MessageModalService,
  ) {
    this.table$ = this.tableService.currentTable$;
  }

  async ngOnInit(): Promise<void> {
    await this.tableService.joinTable(Number(this.route.snapshot.paramMap.get('id')));
    if (!this.tableService.currentTable$()) {
      this.modalService.open({
        title: 'Table inaccessible',
        message: 'La table est introuvable ou pleine ou votre pseudo est déjà utilisé dans cette table.',
        confirmLabel: 'Voir les tables',
        redirectTo: ['/tables'],
      });
    }
  }

  startGame() {
    console.log('Démarrage de la partie pour la table', this.table$()?.table_id);
    this.tableService.startGame(this.table$()?.table_id!);
  }

  async leaveTable() {
    this.modalService.open({
      title: 'Quitter la table',
      message: 'Quitter la table ?',
      type: 'confirm',
      confirmLabel: 'Oui',
      cancelLabel: 'Non',
      onConfirm: async () => {
        console.log('Quitter la table', this.table$()?.table_id);
        await this.tableService.leaveTable(this.table$()?.table_id!);
      },
      redirectTo: [''],
    });
  }
}
