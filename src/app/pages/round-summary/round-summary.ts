import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from '../../composants/card/card';
import { RoundSummaryModel } from '../../models/roundSummaryModel';

@Component({
  selector: 'app-round-summary',
  imports: [Card],
  templateUrl: './round-summary.html',
  styleUrl: './round-summary.css',
})
export class RoundSummary {
  @Input() summary: RoundSummaryModel | null = null;
  @Output() continue = new EventEmitter<void>();

  get gainCount() {
    return this.summary?.players.filter((p) => p.chips_change > 0).length ?? 0;
  }

  onContinue() {
    this.continue.emit();
  }
}
