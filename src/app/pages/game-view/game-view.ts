import { ChangeDetectorRef, Component, computed, ElementRef, inject, QueryList, ViewChild, ViewChildren, AfterViewInit, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardModel } from '../../models/cardModel';
import { Card } from '../../composants/card/card';
import { TableService } from '../../services/TableService';
import { Table } from '../../models/tableModel';
import { Player } from '../../models/playerModel';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game-view',
  imports: [ReactiveFormsModule, Card],
  templateUrl: './game-view.html',
  styleUrl: './game-view.css',
})
export class GameView implements OnInit, AfterViewInit, OnChanges{
  tableService = inject(TableService);
  table$ = this.tableService.currentTable$;

  raiseForm: FormGroup;
  raiseAmount = 10;

  playerMessages: Record<
    string,
    { text: string; type: 'fold' | 'call' | 'raise' | 'allin' } | null
  > = {};

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
      cardEl.style.transition = 'transform 600ms cubic-bezier(.2,.8,.2,1), opacity 600ms';
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
  ) {
    this.raiseForm = this.fb.group({
      raiseAmount: [this.raiseAmount, [Validators.required, Validators.min(5)]],
    });
  }

  async ngOnInit(): Promise<void> {
    // simulation d'un tour de jeu
    if (!this.table$()) {
      await this.tableService.joinTable(Number(this.route.snapshot.paramMap.get('id')));
    }
    // this.showTurnNotification();
    this.showPlayerMessage(this.tableService.username$(), "ALL IN", 'allin');
    // this.showPlayerMessage(this.tableService.username$(), "Folded", 'fold');
    // this.showPlayerMessage(this.tableService.username$(), "Call", 'call');
    // this.showPlayerMessage(this.tableService.username$(), "Raise", 'raise');
  }

  sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

  ngAfterViewInit() {
    console.log(this.cardRefs)
    // cardRef with index +10 are community cards and 0 and 1 are hand cards
    // ref.nativeElement.dataset.index to get index
    this.cardRefs.changes.subscribe(() => {
      this.cardRefs.forEach(async (ref) => {
        this.animateCardToPosition(ref.nativeElement);
        // console.log(ref.nativeElement.dataset.index)
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.table$.update((old) => old ? ({
      ...old,
      table_cards: old.table_cards.slice(0, 3)
    }) : null)
    console.log(this.table$())
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

  showTurnNotification() {
    this.showTurnMessage = true;

    setTimeout(() => {
      this.showTurnMessage = false;
      this.cdr.detectChanges();
    }, 1900);
  }

  showPlayerMessage(playerName: string, message: string, message_type: 'fold' | 'call' | 'raise' | 'allin') {
    this.playerMessages[playerName] = { text: message, type: message_type};

    setTimeout(() => {
      this.playerMessages[playerName] = null;
      this.cdr.detectChanges();
    }, 1500);
  }
}
