import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameSummaryModel } from 'app/models/roundSummaryModel';

@Component({
  selector: 'app-game-summary',
  imports: [],
  templateUrl: './game-summary.html',
  styleUrl: './game-summary.css',
})
export class GameSummary {
  @Input() summary: GameSummaryModel | null = null;
  @Output() leaveTable = new EventEmitter<void>();

  onLeave() {
    this.leaveTable.emit();
  }
}
