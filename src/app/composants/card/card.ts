import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  @Input() value : string = '';
  @Input() suit : string = '';
  suitIcon: string = '';
  valueShowed: string = '';

  ngOnInit(): void {
    switch (this.suit){
      case 'hearts':
        this.suitIcon = '♥'
        break;
      case 'diamonds':
        this.suitIcon = '♦'
        break;
      case 'clubs':
        this.suitIcon = '♣'
        break;
      case 'spades':
        this.suitIcon = '♠'
    }
    
    switch (this.value){
      case 'king':
        this.valueShowed = 'K'
        break;
      case 'queen':
        this.valueShowed = 'Q'
        break;
      case 'jack':
        this.valueShowed = 'J'
        break;
      case 'ace':
        this.valueShowed = 'A'
        break;
      default:
        this.valueShowed = this.value
    }
  }
}
