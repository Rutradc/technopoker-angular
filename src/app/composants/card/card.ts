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
  @Input() size : string = 'm';
  @Input() isFaceDown : boolean = false;
  @Input() faceDownStyle : string = 'classic';
  suitIcon: string = '';
  valueShowed: string = '';
  @HostBinding('style.--color') color = '#d40000';
  @HostBinding('style.--size') sizeClass = 'm';

  ngOnInit(): void {
    this.sizeClass = this.size;

    if (!this.isFaceDown) {
      this.buildCard();
    }
  }

  private buildCard() {
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

    switch (this.card!.value) {
      case 'king': this.valueShowed = 'K'; break;
      case 'queen': this.valueShowed = 'Q'; break;
      case 'jack': this.valueShowed = 'J'; break;
      case 'ace': this.valueShowed = 'A'; break;
      default: this.valueShowed = this.card!.value;
    }
  }
}
