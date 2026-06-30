import { ChangeDetectorRef, Component, computed, ElementRef, inject, QueryList, ViewChild, ViewChildren, AfterViewInit, OnInit, effect} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Card } from '../../components/card/card';
import { GameSummaryModel, RoundSummaryModel } from '../../models/roundSummaryModel';
import { RoundSummary } from '../../components/round-summary/round-summary';
import { TableService } from '../../services/TableService';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerAction } from 'app/models/playerActionModel';
import { GameSummary } from "app/components/game-summary/game-summary";

@Component({
  selector: 'app-game-view',
  imports: [ReactiveFormsModule, Card, RoundSummary, GameSummary],
  templateUrl: './game-view.html',
  styleUrl: './game-view.css',
})
export class GameView implements OnInit, AfterViewInit{
  tableService = inject(TableService);
  table$ = this.tableService.currentTable$;

  raiseForm: FormGroup;
  raiseAmount = 10;

  playerMessages: Record<
    string,
    { text: string; action: string; } | null
  > = {};

  roundSummary: RoundSummaryModel | null = null;
  gameSummary: GameSummaryModel | null = null;
  
  @ViewChild('deckRef') deckRef!: ElementRef;
  @ViewChildren('cardRef', { read: ElementRef }) cardRefs!: QueryList<ElementRef>;

  animateCardToPosition(cardEl: HTMLElement) {
    const deckRect = this.deckRef.nativeElement.getBoundingClientRect();
    const cardRect = cardEl.getBoundingClientRect();

    const deltaX = deckRect.left - cardRect.left;
    const deltaY = deckRect.top - cardRect.top;

    // position initiale = deck
    cardEl.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.8)`;
    cardEl.style.transition = 'none';

    requestAnimationFrame(() => {
      cardEl.style.transition = 'transform 600ms cubic-bezier(.2,.8,.2,1)';
      cardEl.style.transform = `translate(0, 0) scale(1)`;
    });
  }

  pot$ = computed(() => {
    const table = this.table$();
    return table ? table.pot : 0;
  });

  showTurnMessage = false;

  communityCards$ = computed(() => {
    const table = this.table$();
    return table ? table.table_cards : [];
  });

  actionAnimationListener = effect(() =>{
    const lastPlayerAction = this.tableService.lastPlayerAction$()
    console.log(lastPlayerAction)

    if (lastPlayerAction)
      this.showPlayerMessage(lastPlayerAction);
  })

  endRoundListener = effect(() => {
    const roundSummary = this.tableService.roundSummary$()
    if (roundSummary)
      this.displayRoundSummary(roundSummary);
  })

  endGameListener = effect(() => {
    const gameSummary = this.tableService.gameSummary$()
    if (gameSummary)
      this.displayGameSummary(gameSummary);
  })

  playerHand$ = computed(() => {
    const table = this.table$();
    if (!table) return [];
    const currentPlayer = table.players.find(
      (p) => p.player_name === this.tableService.username$(),
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
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.raiseForm = this.fb.group({
      raiseAmount: [this.raiseAmount, [Validators.required, Validators.min(5)]],
    });
  }

  async ngOnInit(): Promise<void> {
    if (!this.table$()) {
      await this.tableService.joinTable(Number(this.route.snapshot.paramMap.get('id')));
    }
    if (!this.tableService.currentTable$()) {
      this.router.navigate(['/tables']);
      alert(
        'La table est introuvable ou pleine ou votre pseudo est déjà utilisé dans cette table.',
      );
    }
    // message qui dit c'est ton tour
    // this.showTurnNotification();
  }

  ngAfterViewInit() {
    this.cardRefs.changes.subscribe(() => {
      let maxIndex = this.cardRefs.toArray().sort((ref1, ref2) => +ref2.nativeElement.dataset.index - +ref1.nativeElement.dataset.index)[0].nativeElement.dataset.index
      console.log(maxIndex)
      if (maxIndex > 12){
        let cardToAnimate = this.cardRefs.find((ref) => ref.nativeElement.dataset.index == maxIndex)
        this.animateCardToPosition(cardToAnimate?.nativeElement);
      }
      else {
        if (maxIndex >= 10) {
          this.cardRefs.forEach(async (ref) => {
            if (ref.nativeElement.dataset.index >= 10)
              this.animateCardToPosition(ref.nativeElement);
          });
        }
        else {
          this.cardRefs.forEach(async (ref) => {
            this.animateCardToPosition(ref.nativeElement);
          });
        }
      }
    });

    const newSummary: RoundSummaryModel = {
      round_number: 3,
      winner_name: 'Alice',
      pot: 520,
      community_cards: [
        { rank: 10, suit: 'hearts' },
        { rank: 11, suit: 'spades' },
        { rank: 12, suit: 'diamonds' },
        { rank: 7, suit: 'clubs' },
        { rank: 2, suit: 'hearts' },
      ],
      players: [
        {
          player_name: 'Alice',
          hand: [
            { rank: 14, suit: 'spades' },
            { rank: 13, suit: 'hearts' },
          ],
          // chips_change: 180,
          // is_winner: true,
        },
        {
          player_name: 'Bob',
          hand: [
            { rank: 10, suit: 'clubs' },
            { rank: 10, suit: 'diamonds' },
          ],
          // chips_change: -60,
          // is_winner: false,
        },
        {
          player_name: 'Claire',
          hand: [
            { rank: 8, suit: 'hearts' },
            { rank: 9, suit: 'spades' },
          ],
          // chips_change: -120,
          // is_winner: false,
        },
        {
          player_name: 'David',
          hand: [
            { rank: 5, suit: 'clubs' },
            { rank: 7, suit: 'diamonds' },
          ],
          // chips_change: -40,
          // is_winner: false,
        },
      ],
    };
    // this.displayRoundSummary(newSummary);
  }

  fold() {
    this.tableService.fold(this.table$()?.table_id!);
  }

  call() {
    this.tableService.call(this.table$()?.table_id!);
  }

  raise() {
    const value = this.raiseForm.value.raiseAmount;
    this.raiseAmount = value;
    this.tableService.raise(this.table$()?.table_id!, value);
  }

  allIn() {
    const table = this.table$();
    if (!table) return;

    const currentPlayer = table.players.find(
      (p) => p.player_name === this.tableService.username$()
    );

    if (!currentPlayer) return;

    this.tableService.allIn(table.table_id);
  }

  showTurnNotification() {
    this.showTurnMessage = true;

    setTimeout(() => {
      this.showTurnMessage = false;
      this.cdr.detectChanges();
    }, 1900);
  }

  showPlayerMessage(playerAction: PlayerAction) {
    let textMessage = ""
    switch (playerAction.action){
      case 'all_in':
        textMessage = 'ALL IN'
        break;
      case 'call':
        textMessage = 'CALL'
        break
      case 'fold':
        textMessage = 'FOLD'
        break
      case 'raise':
        textMessage = `${playerAction.amount} RAISE`
    }
    this.playerMessages[playerAction.player_name] = { text: textMessage, action: playerAction.action };

    setTimeout(() => {
      this.playerMessages[playerAction.player_name] = null;
      this.cdr.detectChanges();
    }, 1500);
  }

  displayRoundSummary(summary: RoundSummaryModel) {
    this.roundSummary = summary;
  }

  displayGameSummary(summary: GameSummaryModel) {
    this.gameSummary = summary;
  }

  async handleRoundContinue() {
    const tableId = this.table$()?.table_id;
    this.roundSummary = null;
    if (tableId) {
      await this.tableService.readyForNextRound(tableId);
    }
  }

  async leaveTable() {
    const tableId = this.table$()?.table_id;
    this.gameSummary = null;
    if (tableId) {
      await this.tableService.leaveTable(tableId)
      this.router.navigate([''])
    }
  }
}
