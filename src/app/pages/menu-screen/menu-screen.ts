import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu-screen',
  imports: [ReactiveFormsModule],
  templateUrl: './menu-screen.html',
  styleUrl: './menu-screen.css',
})
export class MenuScreen {
  form: FormGroup;
  username: string = '';
  confirmedUsername = false;

  constructor(private fb: FormBuilder) {
    const saved = localStorage.getItem('username');

    this.form = this.fb.group({
      username: [saved ? saved : '', [Validators.required, Validators.minLength(2)]]
    });
  }

  confirmUsername() {
    if (this.form.invalid) return;

    const value = this.form.value.username.trim();

    this.username = value;
    localStorage.setItem('username', value);
    this.confirmedUsername = true;
  }

  createGame() {
    console.log('Créer partie avec:', this.username);
  }

  joinGame() {
    console.log('Rejoindre partie avec:', this.username);
  }
}
