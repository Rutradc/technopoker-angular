import { Component, Input } from '@angular/core';
import { Card } from "../card/card";
import { RoundSummaryModel } from 'app/models/roundSummaryModel';

@Component({
  selector: 'app-game-summary',
  imports: [Card],
  templateUrl: './game-summary.html',
  styleUrl: './game-summary.css',
})
export class GameSummary {
  @Input() summary: RoundSummaryModel | null = null;
}
