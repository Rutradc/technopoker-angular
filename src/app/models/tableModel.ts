import { CardModel } from './cardModel';
import { Player } from './playerModel';

export class Table {
  table_id: number;
  host_name: string;
  table_cards: CardModel[];
  pot: number;
  players: Player[];
  small_blind_value: number;
  big_blind_value: number;
  current_player_name: string | null;
  small_blind_player_name: string | null;
  big_blind_player_name: string | null;

  constructor(
    table_id: number,
    host_name: string,
    table_cards: CardModel[],
    pot: number,
    players: Player[],
    current_player_name: string | null,
    small_blind_value: number,
    big_blind_value: number,
    small_blind_player_name: string | null,
    big_blind_player_name: string | null,
  ) {
    this.table_id = table_id;
    this.host_name = host_name;
    this.table_cards = table_cards;
    this.pot = pot;
    this.players = players;
    this.current_player_name = current_player_name;
    this.small_blind_value = small_blind_value;
    this.big_blind_value = big_blind_value;
    this.small_blind_player_name = small_blind_player_name;
    this.big_blind_player_name = big_blind_player_name;
  }
}
