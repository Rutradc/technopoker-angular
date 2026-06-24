import { Component, HostBinding, Input } from '@angular/core';
import { CardModel } from '../../models/cardModel';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  @Input() card: CardModel | undefined;
  @Input() value: number = 0;
  @Input() suit: string = '';
  @Input() size: string = 'm';
  suitIcon: string = '';
  valueShowed: string = '';
  @HostBinding('style.--color') color = '#d40000';
  @HostBinding('style.--size') sizeClass = 'm';

  ngOnInit(): void {
    if (!this.card) {
      this.card = new CardModel(this.value, this.suit);
    }

    switch (this.card.suit) {
      case 'hearts':
        this.suitIcon = '♥';
        break;
      case 'diamonds':
        this.suitIcon = '♦';
        break;
      case 'clubs':
        this.suitIcon = '♣';
        this.color = '#000000';
        break;
      case 'spades':
        this.suitIcon = '♠';
        this.color = '#000000';
    }

    switch (this.card.rank) {
      case 13:
        this.valueShowed = 'K';
        break;
      case 12:
        this.valueShowed = 'Q';
        break;
      case 11:
        this.valueShowed = 'J';
        break;
      case 14:
        this.valueShowed = 'A';
        break;
      default:
        this.valueShowed = this.card.rank.toString();
    }

    switch (this.size) {
      case 's':
        this.sizeClass = 's';
        break;
      case 'm':
        this.sizeClass = 'm';
        break;
      case 'l':
        this.sizeClass = 'l';
        break;
    }
  }
}
