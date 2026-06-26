import { Component, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableService } from '../../services/TableService';

@Component({
  selector: 'app-menu-screen',
  imports: [ReactiveFormsModule],
  templateUrl: './menu-screen.html',
  styleUrl: './menu-screen.css',
})
export class MenuScreen {
  form: FormGroup;
  username = computed(() => this.tableService.username$());
  connected = computed(() => this.tableService.connected());

  constructor(private fb: FormBuilder, private router: Router, private tableService: TableService) {
    this.form = this.fb.group({
      username: [this.username() ? this.username() : '', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    if (this.username()) {
      this.tableService.connect();
    }
    if (this.tableService.currentTable$()){
      if (confirm(`Vous étiez connecté à la partie ${this.tableService.currentTable$()?.table_id}, voulez-vous vous reconnecter à cette partie ?`)){
        if (this.tableService.currentTable$()?.has_started)
          this.router.navigate([`/game/${this.tableService.currentTable$()?.table_id}`])
        else
          this.router.navigate([`/table/${this.tableService.currentTable$()?.table_id}`])
      }
    }
  }

  confirmUsername() {
    if (this.form.invalid) return;

    const value = this.form.value.username.trim();

    this.tableService.username$.set(value);
    localStorage.setItem('username', value);
    this.tableService.connect();
  }

  editUsername() {
    this.tableService.disconnect();

    // remettre valeur actuelle dans le form
    this.form.patchValue({
      username: this.username()
    });
  }

  async createGame() {
    console.log('Créer partie avec:', this.username);
    await this.tableService.createTable();
    console.log(this.tableService.currentTable$());
    let id = this.tableService.currentTable$()?.table_id;
    this.router.navigate([`/table/${id}`]);
  }

  joinGame() {
    console.log('Rejoindre partie avec:', this.username);
    this.router.navigate(['/tables']);
  }
}
