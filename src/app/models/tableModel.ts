import { CardModel } from './cardModel';
import { Player } from './playerModel';

export class Table {
  table_id: number;
  host_name: string;
  table_cards: CardModel[];
  pot: number;
  players: Player[];

  constructor(
    table_id: number,
    host_name: string,
    table_cards: CardModel[],
    pot: number,
    players: Player[],
  ) {
    this.table_id = table_id;
    this.host_name = host_name;
    this.table_cards = table_cards;
    this.pot = pot;
    this.players = players;
  }
}
