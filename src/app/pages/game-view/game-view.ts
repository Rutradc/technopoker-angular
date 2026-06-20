import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardModel } from '../../models/cardModel';
import { Card } from "../../composants/card/card";

@Component({
  selector: 'app-game-view',
  imports: [ReactiveFormsModule, Card],
  templateUrl: './game-view.html',
  styleUrl: './game-view.css',
})
export class GameView {
  raiseForm: FormGroup;
  raiseAmount = 10;

  pot = 120;

  communityCards = [
    new CardModel('A', 'hearts'), 
    new CardModel('K', 'spades'), 
    new CardModel('Q', 'diamonds')
  ]; // exemple


  playerHand = [
    new CardModel('J', 'clubs'), 
    new CardModel('10', 'hearts')
  ];


  players = [
    { username: 'Alice', chips: 500, bet: 20, inRound: true, isTurn: false },
    { username: 'Bob', chips: 320, bet: 40, inRound: true, isTurn: true },
    { username: 'Charlie', chips: 150, bet: 0, inRound: false, isTurn: false }
  ];

  constructor(private fb: FormBuilder) {
    this.raiseForm = this.fb.group({
      raiseAmount: [this.raiseAmount, [Validators.required, Validators.min(5)]]
    });
  }

  fold() {
    console.log('Fold');
  }

  call() {
    console.log('Call');
  }

  raise() {
    const value = this.raiseForm.value.raiseAmount;
    this.raiseAmount = value;
    console.log('Raise:', this.raiseAmount);
  }
}
