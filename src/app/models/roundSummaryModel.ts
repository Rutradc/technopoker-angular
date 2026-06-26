import { CardModel } from './cardModel';

export interface RoundPlayerSummary {
  player_name: string;
  hand: CardModel[];
  chips_change: number;
  is_winner: boolean;
}

export interface RoundSummaryModel {
  round_number: number;
  winner_name: string | null;
  pot: number;
  community_cards: CardModel[];
  players: RoundPlayerSummary[];
}
