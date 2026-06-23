import { CardModel } from './cardModel';

export class Player {
  player_name: string;
  hand?: CardModel[];
  chips: number;
  current_bet: number;
  is_folded: boolean;
  is_out: boolean;

  constructor(
    name: string,
    hand: CardModel[],
    chips: number,
    current_bet: number,
    is_folded: boolean,
    is_out: boolean,
  ) {
    this.player_name = name;
    this.hand = hand;
    this.chips = chips;
    this.current_bet = current_bet;
    this.is_folded = is_folded;
    this.is_out = is_out;
  }
}
