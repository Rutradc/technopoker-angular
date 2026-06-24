import { ChangeDetectorRef, Component, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardModel } from '../../models/cardModel';
import { Card } from '../../composants/card/card';
import { TableService } from '../../services/TableService';
import { Table } from '../../models/tableModel';
import { Player } from '../../models/playerModel';

@Component({
  selector: 'app-game-view',
  imports: [ReactiveFormsModule, Card],
  templateUrl: './game-view.html',
  styleUrl: './game-view.css',
})
export class GameView {
  tableService = inject(TableService);
  // table$ = this.tableService.currentTable$;
  big_blind_player_name = "Luigi";
  big_blind_value = 20;
  current_player_name = "Toad";
  host_name = "Luigi";
  players = [
    new Player("Luigi", [new CardModel("jack", "hearts"), new CardModel("king", "diamonds")], 800, 200, false, false),
    new Player("Mario", [], 900, 100, true, false),
    new Player("Peach", [], 0, 0, false, true),
    new Player("Toad", [], 800, 200, false, false),
    new Player("Yoshi", [], 1000, 0, false, false),
    new Player("Bowser", [], 500, 0, false, false),
    new Player("Wario", [], 300, 0, false, false),
    new Player("Waluigi", [], 700, 0, false, false),
    new Player("Donkey Kong", [], 600, 0, false, false),
  ];
  pot = 120;
  small_blind_player_name = "Mario";
  small_blind_value = 10;
  table_cards = [
    new CardModel("ace", "hearts"),
    new CardModel("king", "spades"),
    new CardModel("queen", "diamonds"),
    new CardModel("jack", "clubs"),
    new CardModel("10", "hearts")
  ];
  table_id = 2006612505808;
  tableTest : Table = new Table(this.table_id, this.host_name, this.table_cards, this.pot, this.players, this.current_player_name, this.small_blind_value, this.big_blind_value, this.small_blind_player_name, this.big_blind_player_name);
          
  table$ = computed(() => this.tableTest);

  raiseForm: FormGroup;
  raiseAmount = 10;

  pot$ = computed(() => {
    const table = this.table$();
    return table ? table.pot : 0;
  });

  showTurnMessage = false;

  communityCards$ = computed(() => {
    const table = this.table$();
    return table ? table.table_cards : [];
  });

  playerHand$ = computed(() => {
    const table = this.table$();
    if (!table) return [];
    const currentPlayer = table.players.find(
      (p) => p.player_name === localStorage.getItem('username'),
    );
    return currentPlayer ? currentPlayer.hand : [];
  });

  players$ = computed(() => {
    const table = this.table$();
    return table ? table.players : [];
  });

  currentPlayerName$ = computed(() => {
    const table = this.table$();
    return table ? table.current_player_name : null;
  });

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.raiseForm = this.fb.group({
      raiseAmount: [this.raiseAmount, [Validators.required, Validators.min(5)]],
    });
  }

  ngOnInit(): void {
    // simulation d'un tour de jeu
    this.showTurnNotification();
  }

  fold() {
    console.log('Fold');
  }

  call() {
    console.log('Call');
  }

  raise() {
    const value = this.raiseForm.value.raiseAmount;
    this.raiseAmount = value;
    console.log('Raise:', this.raiseAmount);
  }

  showTurnNotification() {
    this.showTurnMessage = true;

    setTimeout(() => {
      this.showTurnMessage = false;
      this.cdr.detectChanges();
    }, 1900);
  }
}
