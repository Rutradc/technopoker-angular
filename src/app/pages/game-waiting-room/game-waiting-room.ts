import { Component } from '@angular/core';
import { TableInfo } from '../../models/tableModel';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-game-waiting-room',
  imports: [],
  templateUrl: './game-waiting-room.html',
  styleUrl: './game-waiting-room.css',
})
export class GameWaitingRoom {
  tableId!: number;

  table?: TableInfo;
  username: string = localStorage.getItem('username') || '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.tableId = Number(this.route.snapshot.paramMap.get('id'));

    // ⚠️ simulation (plus tard → API backend)
    this.table = {
      id: this.tableId,
      num_players: 3,
      host_name: 'Alice'
    };
  }

  startGame() {
    console.log('Démarrage de la partie pour la table', this.table?.id);
    this.router.navigate(['/game', this.table?.id]);
  }
}
