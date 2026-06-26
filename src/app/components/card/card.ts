import { Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CardModel } from '../../models/cardModel';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card implements OnChanges {
  @Input() card: CardModel | undefined;
  @Input() size: string = 'm';
  @Input() isFaceDown: boolean = false;
  @Input() faceDownStyle: string = 'classic';
  suitIcon: string = '';
  valueShowed: string = '';
  @HostBinding('style.--color') color = '#d40000';
  @HostBinding('style.--size') sizeClass = 'm';

  ngOnChanges(changes: SimpleChanges): void {
    this.sizeClass = this.size;

    if (this.isFaceDown || !this.card) {
      this.resetCard();
      return;
    }

    this.buildCard();
  }

  private resetCard() {
    this.suitIcon = '';
    this.valueShowed = '';
    this.color = '#d40000';
  }

  private buildCard() {
    this.resetCard();

    switch (this.card!.suit) {
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
        break;
    }

    switch (this.card!.rank) {
      case 14:
        this.valueShowed = 'A';
        break;
      case 13:
        this.valueShowed = 'K';
        break;
      case 12:
        this.valueShowed = 'Q';
        break;
      case 11:
        this.valueShowed = 'J';
        break;
      default:
        this.valueShowed = this.card!.rank.toString();
        break;
    }
  }
}
